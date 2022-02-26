const fs = require("fs");
const ia = require("./ia");
const { delay, rand, makeid } = require("./functions");

var moment = require("moment");
moment.locale("pt-br");

const data = require("../config.json");
const db = require("./db");
const schedule = require("node-schedule");

const mercadopago = require("mercadopago");
const mercadoPagoAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const mercadoPagoClientId = process.env.MERCADO_PAGO_CLIENT_ID;

if (!mercadoPagoAccessToken) {
  console.log("Error: access token not defined");
  process.exit(1);
}

mercadopago.configurations.setAccessToken(mercadoPagoAccessToken);

const sendMsg = async (payload, client) => {
  await client.presenceSubscribe(payload.from);
  await delay(rand(500));

  if (payload.type == "audio")
    await client.sendPresenceUpdate("recording", payload.from);
  else await client.sendPresenceUpdate("composing", payload.from);

  await delay(rand(2000));
  await client.sendPresenceUpdate("paused", payload.from);

  switch (payload.type) {
    case "text":
      await client.sendMessage(payload.from, { text: payload.message });
      break;

    case "image":
      await client.sendMessage(payload.from, {
        image: fs.readFileSync(payload.config.file),
        caption: payload.message,
      });
      break;

    case "audio":
      await client.sendMessage(payload.from, {
        audio: { url: payload.config.file },
        //mimetype: "audio/ogg",
        ptt: true,
      });
      break;

    case "button2":
      var templateButtons = [];
      payload.buttons.forEach(function (button, i) {
        templateButtons.push({
          index: i + 1,
          quickReplyButton: {
            displayText: button,
            id: i + 1,
          },
        });
      });

      var templateMessage = {
        text: payload.message,
        footer: payload.footer,
        templateButtons: templateButtons,
      };

      await client.sendMessage(payload.from, templateMessage);

      // send a buttons message with image header!
      /*
    image message whit buttons
    const buttons = [
        {buttonId: 'id1', buttonText: {displayText: 'Button 1'}, type: 1},
        {buttonId: 'id2', buttonText: {displayText: 'Button 2'}, type: 1},
        {buttonId: 'id3', buttonText: {displayText: 'Button 3'}, type: 1}
      ]
      
      const buttonMessage = {
          image: {url: 'https://japaraiba.mg.gov.br/upload/news/images/default/71d3f0fda8a89903ad860529fb96152b.jpeg'},
          caption: "Hi it's button message",
          footerText: 'Hello World',
          buttons: buttons,
          headerType: 4
      }
     
    
      const sendMsg = await client.sendMessage(payload.from, buttonMessage) */
      break;

    case "button":
      var templateButtons = [];

      payload.config.buttons.forEach(function (button, i) {
        if (button.type == "link") {
          templateButtons.push({
            index: i + 1,
            urlButton: {
              displayText: button.text,
              url: button.action,
            },
          });
        }
        if (button.type == "call") {
          templateButtons.push({
            index: i + 1,
            callButton: {
              displayText: button.text,
              phoneNumber: button.action,
            },
          });
        }
        if (button.type == "text") {
          templateButtons.push({
            index: i + 1,
            quickReplyButton: {
              displayText: button.text,
              id: button.action,
            },
          });
        }
      });

      var templateMessage = {
        text: payload.message,
        footer: payload.footer,
        templateButtons: templateButtons,
      };

      await client.sendMessage(payload.from, templateMessage);
      break;
  }
};

const processMessage = async (msg, client) => {
  //MARCA A MENSAGEM COMO LIDA
  await client.sendReadReceipt(msg.key.remoteJid, undefined, [msg.key.id]);

  var mensagem = msg.message.conversation.toLowerCase();

  if (!mensagem) {
    //console.log(msg.message.templateButtonReplyMessage); // null
    if (msg.message.templateButtonReplyMessage != null)
      //msg.message.templateButtonReplyMessage.selectedId
      var mensagem = msg.message.templateButtonReplyMessage.selectedDisplayText;
  }

  const intent = await ia.intent(mensagem);
  const user = msg.key.remoteJid.replace(/\D/g, "");


  try {
    const getLead = await db.getLead(user);
    /*console.log(getLead);*/
    if (getLead == false) {
      // lead não cadastrado
    } else {
      const id = getLead[0].id;
      const prize_uuid = getLead[0].prize_uuid;
      const stage = getLead[0].stage;
      const fullName = getLead[0].name;
      const uuid = getLead[0].uuid;
      const name = getLead[0].name.replace(/ .*/, "");
      const conversion_type = getLead[0].conversion_type;

      //INFORMAÇÕES SOBRE O PREMIO DO SORTEIO

      const getPrize = await db.getPrize(prize_uuid);
      const prize = getPrize[0].prize;
      const prize_pre = getPrize[0].prize_pre;
      const prizeDate = moment(getPrize[0].prize_end).format("DD-MM-YYYY");
      const prizePrice = getPrize[0].prize_price;

      if (stage == "0") {
        // se receber uma mensagem em menos de 30 segundos....
        // cancela o Job que envia a mensagem automatica
        const cancelJob = schedule.cancelJob(user);
        if (cancelJob == true)
          console.log(`O job de Remarketing de ${user} foi cancelado`);

        //aceitar qualquer resposta e responde com...
        const luckNumbers = await db.createLuckNumbers(
          id,
          prize_uuid,
          data.freeLuckNumbers,
          "INACTIVE"
        );

        await sendMsg(
          {
            type: "button2",
            message: `${
              conversion_type == "BOT"
                ? `Tudo bem, aqui `
                : `Tudo bem *${name}*`
            }estão seus *${
              data.freeLuckNumbers
            }* números da sorte que eu prometi.
                \n${luckNumbers.join(", ")}. 
                \nQuero te desejar boa sorte 🍀
                \n☝️Lembrando que se você for o ganhador, para receber o prêmio você deve estar *seguindo nosso Instagram.* 
                \n👉 ${data.site}/instagram
                \nAssim que estiver seguindo nosso perfil *envie "OK" aqui no zap para  ATIVAR do seus números da sorte e começar a concorrer.*`,
            from: msg.key.remoteJid,
            footer: "",
            buttons: ["QUERO ATIVAR MEUS NUMEROS"],
          },
          client
        );

        await db.updateStage(user, 1);
      } else if (stage == "1") {
        if (intent.intent == "CONFIRMACAO") {
          await sendMsg(
            {
              type: "image",
              message: `Olha, você pode ganhar ${prize_pre} *${prize}*.`,
              from: msg.key.remoteJid,
              config: {
                file: "./media/1.jpg",
              },
            },
            client
          );
          await delay(1000);
          await sendMsg(
            {
              type: "text",
              message: `*IMPORTANTE:* Para *ATIVAR* seus números da sorte você deve:
              \nCompartilhar seu link unico com *5 ou mais amigos e pronto*.
              \nPara cada amigo seu que participar do sorteio a qualquer momento você ganha automaticamente *+5 números da sorte*.
              \n*Não é preciso comprar nada para participar* 😃 e você pode compartilhar _quantas vezes_ quiser dentro de ⏱️ *15 minutos*. Vou te enviar seu link único para você começar.`,
              from: msg.key.remoteJid,
            },
            client
          );
          await delay(1500);
          await sendMsg(
            {
              type: "text",
              message: `Aqui está, *clique no link e compartilhe* \n→ ${data.site}/s/${uuid}`,
              from: msg.key.remoteJid,
            },
            client
          );
          await delay(4000);
          await sendMsg(
            {
              type: "button2",
              message: `*SOMENTE QUANTO TERMINAR* clique aqui 👇, para seus números sejam contabilizados e gerados.`,
              from: msg.key.remoteJid,
              footer: "",
              buttons: ["TERMINEI DE COMPARTILHAR"],
            },
            client
          );
          await db.updateStage(user, 2);
        } else {
        }
 
      } else {
        // processa a requisição
      }
    }
  } catch (e) {
    console.log(e);
  }

};

/* API EXPRESS SENDS */

const prizeData = async (req, res, prize_uuid, uuid) => {
  //const getPrize = await db.getPrize(prize_uuid);
 
    return res.render("entrar.ejs", {
      uudi: uuid ? uuid : false,
     // data: getPrize[0],
      config: data,
    });

};

const postLeads = async (req, res, client) => {
  const whatsapp = req.body.whatsapp;
  const lead = req.body.name;

  var level = 0,
    reference = 0,
    uuid = req.body.uuid;

  const prize_uuid = req.body.prize_uuid;
  const getLead = await db.getLeadbyUUID(uuid);
  console.log(getLead);

  //existe o numero indicado então ...
  if (getLead !== false) {
    var level = parseInt(getLead[0].level) + 1,
      reference = getLead[0].id;
    //da o premio de cadastro para a pessoas ...
  }

  //const getPrize = await db.getLead("ABC123");
  //console.log(getPrize);

  // Check if the number exists
  const [result] = await client.onWhatsApp("55" + whatsapp);
  if (result.exists) {
    console.log(result);
    //{ exists: true, jid: '553788555554@s.whatsapp.net' }

    const newLead = await db.newLead(
      result.jid.replace(/\D/g, ""),
      result.jid,
      lead,
      prize_uuid, // cadastrou para qua premio
      level, //nivel da funil de indicação
      reference, // referencia do usuaio que indicou
      makeid(5)
    );

    const getPrize = await db.getPrize(prize_uuid);
    const prize = getPrize[0].prize;
    const prize_pre = getPrize[0].prize_pre;
    const prizeDate = moment(getPrize[0].prize_end).format("DD-MM-YYYY");
    const prizePrice = getPrize[0].prize_price;

    var date = new Date();
    date.setSeconds(date.getSeconds() + 30);
    //pegar as indormações do lead apos o cadastro

    const getLead = await db.getLead(result.jid.replace(/\D/g, ""));
    const user = getLead[0].user;
    const _serialized = getLead[0]._serialized;
    const name = getLead[0].name.replace(/ .*/, "");

    console.log(`O Job de ${name} para Whastapp ${user} foi AGENDADO`);

    const job = schedule.scheduleJob(user, date, async function () {
      console.log(`O Job de ${name} para Whastapp ${user} foi EXECUTADO`);

      sendMsg(
        {
          type: "button2",
          message: `*${name}*, eu tenho uma pergunta muito importante para te fazer e você pode gostar de ouvir...
          \nVocê quer ainda quer receber GRATIS *seus 10 números da 🍀 sorte* para concorrer ao sorteio de ${prize_pre} *${prize}* no dia *${prizeDate}* ao vivo no nosso Instagram *${data.instagram}* ?`,
          from: _serialized,
          footer: "",
          buttons: [
            "SIM, QUERO RECEBER GRÁTIS",
            "NÃO, QUERO DESISTIR DE CONCORRER",
          ],
        },
        client
      );
    });

    await db.updateConversionType(user, "BOT");
  } else {
    //numero não existe
  }

  return res.status(200).json({
    status: true,
    message: "Cadastro Concluido",
  });
};

module.exports = {
  sendMsg,
  processMessage,
  postLeads,
  prizeData,
};
