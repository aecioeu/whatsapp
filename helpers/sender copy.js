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
      } else if (stage == "2") {
        if (intent.intent == "CONFIRMACAO") {
          //USUARIO MANDA TERMINEI DE COMPARTILHAR COM OS AMIGOS
          await sendMsg(
            {
              type: "text",
              message: `Tudo bem ${name} assim que seus amigos se cadastrarem você vai receber seus *números extras* 🍀 para concorrer ao sorteio.
              \n*É só você aguardar !!* 😁`,
              from: msg.key.remoteJid,
            },
            client
          );

          // TEM QUE SETAR O STAGE DE AGUARDAR ....
          await db.updateStage(user, 99);

          var date = new Date();
          date.setSeconds(date.getSeconds() + 30);

          console.log("O job de Venda foi Agendado");
          const job = schedule.scheduleJob(user, date, async function () {
            await db.updateStage(user, 3);
            console.log("O job de Venda foi Executado");

            await sendMsg(
              {
                type: "button2",
                message: `Ei *${name}*, quero te contar um segredo 🤐, apenas você pode saber disso ... 
                \n\nEu sei que você pode ter se perguntado ... 
                \nEsse sorteio é real 🤔? Como eles conseguem pagar prêmios aos vencedores?
                \n*A resposta é simples*. Nós vendemos os números da sorte para _aumentar as chances das pessoas ganharem_ e arrecadamos esses valores para _pagar o premio dos vencedores_.
         
                \nEu sei que você já tem *25 números da sorte*, mas você não precisa *depender somente da sorte para ganhar* eu vou te mostra como você pode obter essa vantagem inusitada.
                \nClique no saiba mais 👇`,
                from: msg.key.remoteJid,
                footer: "",
                buttons: ["QUERO SABER MAIS"],
              },
              client
            );
          });
        } else {
        }
      } else if (stage == "3") {
        if (intent.intent == "CONFIRMACAO") {
          await sendMsg(
            {
              type: "image",
              message: `*${name}, o que você compraria hoje com 5 reais ? 🧐*
              \nHoje em dia não da pra comprar nem um café né! 😱
              \nAgora imagine se você pudesse investir este _valor irrisório_, *menos de 5 reais* e ser ganhador de ${prize_pre} *${prize}*.`,
              from: msg.key.remoteJid,
              config: {
                file: "./media/2.jpg",
              },
            },
            client
          );

          await delay(5000);
          await sendMsg(
            {
              type: "text",
              message: `E se eu te contasse que há uma maneira ... 🤫
              \nUma *oportunidade única* de sair na frete das outras *${data.peoples[0]} pessoas* já estão participando. Você vai conseguir essa _vantagem injusta_ de ter mais números para concorrer a esse prêmio.
              \n*Você não precisa depender somente da sorte para ganhar*. 
              `,
              from: msg.key.remoteJid,
            },
            client
          );
          await delay(10000);
          await sendMsg(
            {
              type: "button2",
              message: `*ATENÇÃO*: RESPONDA Somente se estiver preparado para receber essa oferta *ÚNICA*.
              \nEntenda que, para *SERMOS JUSTOS COMO TODOS* a oferta vai
              \ndurar *APENAS* ⏱️ *_30 MINUTOS_*.
              \nAssim somente as *PESSOAS QUE QUEREM DE VERDADE O PRÊMIO* conseguirão esse BENEFICIO EXTRA.`,
              from: msg.key.remoteJid,
              footer: "",
              buttons: ["EU QUERO"],
            },
            client
          );

          await db.updateStage(user, 4);
        } else {
        }
      } else if (stage == "4") {
        if (intent.intent == "CONFIRMACAO") {
          await sendMsg(
            {
              type: "text",
              message: `Tudo bem *${name}*, mas antes tenho que avisar que, para ser fiel com todos os participantes e evitar até mesmo a mais remota possibilidade fraude neste sorteio que, só será admissível *comprar uma ÚNICA VEZ números adicionais que aumentam sua chance de ganhar...*`,
              from: msg.key.remoteJid,
            },
            client
          );

          await delay(3800);
          await sendMsg(
            {
              type: "image",
              message: `Esse *${prize}* pode ser seu!! 🙏🙏`,
              from: msg.key.remoteJid,
              config: {
                file: "./media/3.jpg",
              },
            },
            client
          );

          //enviar o audio
          await delay(5000);
          sendMsg(
            {
              type: "audio",
              from: msg.key.remoteJid,
              config: {
                file: "./media/audio1.ogg",
                //mensagem gravada diretamente no whatsapp e depois baixada
              },
            },
            client
          );
          await delay(20000);

          var ItensList = [];

          data.priceList.forEach(function (item, i) {
            ItensList.push(
              `${item.qnt} Números Extras da Sorte por R$${item.price}`
            );
          });

          await sendMsg(
            {
              type: "button2",
              message: `Escolha a Melhor Oferta! 👇\nQuanto mais numeros *mais chanches de ganhar* 🍀 ${prize_pre} *${prize}*!`,
              from: msg.key.remoteJid,
              footer: "*Lembre-se:* Só é possivel comprar *uma vez*",
              buttons: ItensList,
            },
            client
          );

          await db.updateStage(user, 5);
        } else {
        }
      } else if (stage == "5") {
        ItensList.map(function (item) {
          const itemData = item.match(/\d+/g);
          const Offerdata = mensagem.match(/\d+/g);

          //console.log(itemData, Offerdata);

          if (
            itemData[0] == Offerdata[0] &&
            `${itemData[1]}.${itemData[2]}` == `${Offerdata[1]}.${Offerdata[2]}`
          ) {
            var quantity = Offerdata[0];
            var price = parseFloat(`${itemData[1]}.${itemData[2]}`);

            //console.log(quantity, price);
            // GERAR O PIX COPIA E COLA

            const data = {
              external_reference: `PEDIDO ${fullName.toUpperCase()}`,
              payment_method_id: "pix",
              description: `${quantity} Numeros da Sorte`,
              transaction_amount: Number(price),
              notification_url:
                "https://webhook.site/8084c568-96cc-46f1-81b8-bdeb01e22565",
              payer: {
                email: `${name
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")}@gmail.com`,
                first_name: name,
                last_name: `${
                  fullName.split(" ").pop() !== name
                    ? fullName.split(" ").pop()
                    : `Sorteio`
                }`,
                identification: {
                  type: "cli",
                  number: "1234",
                },
              },
            };

            console.log(data);

            mercadopago.payment
              .create(data)
              .then(async function (data) {
                const { response } = data;

                // aguardando confirmação
                await db.updateStage(user, 6);
                await send.Text(msg.from, `Vou gerar seu pagamento...`, client);
                await helper.delay(1000, 2500);
                await send.Text(
                  msg.from,
                  response.point_of_interaction.transaction_data.qr_code,
                  client
                );
                await helper.delay(1000, 2500);
                await send.Text(
                  msg.from,
                  `*COMO PAGAR:* Copie o código acima, acesse o PIX pelo app do seu banco e escolha a opção de pagar, pagar com QR Code ou termo parecido; escolha a opção *“PIX Copia e Cola”* e cole o código que foi enviado`,
                  client
                );
                await helper.delay(1000, 2500);
                // Send image file base64
                /*  await send.Text(msg.from, `Ou você pode pagar pelo qrCode. 👇`, client);
                      await helper.delay(1000, 2500);
                      await client.sendImageFromBase64(msg.from, 'data:image/jpg;base64,' + response.point_of_interaction.transaction_data
                        .qr_code_base64, "qrcode para pagamento")
                        .then((result) => {
                          console.log('Result: ', result); //return object success
                        })
                        .catch((erro) => {
                          console.error('Error when sending: ', erro); //return object error
                        });*/

                console.log({
                  id: response.id,
                  status: response.status,
                  detail: response.status_detail,
                  qrCode:
                    response.point_of_interaction.transaction_data.qr_code,
                  qrCodeBase64:
                    response.point_of_interaction.transaction_data
                      .qr_code_base64,
                });
              })
              .catch(function (error) {
                console.log(error);
              });
          } else {
            console.log("oferta nao encontrada");

            /*send.Text(
                    msg.from,
                    `${name}, por favor ecolha uma das opções acima.`,
                    client
                  );*/
          }
        }); // => [null, { "name": "john", "dinner": "sushi" }, null]
      } else if (stage == "999") {
      } else if (stage == "999") {
      } else {
        // processa a requisição
      }
      /*switch (stage) {

            case "0":
              
              
              break;

              case "1":

               
  
                break;

            default:
              break;
          }*/
    }
  } catch (e) {
    console.log(e);
  }

  /*
  console.log(msg.message.templateButtonReplyMessage); // null
if (msg.message.templateButtonReplyMessage != null)
   msg.message.templateButtonReplyMessage.selectedId
   selectedDisplayText
   */

  /*sendMsg(
    {
      type: "button",
      message: "Olá msg automática",
      from: msg.key.remoteJid,
      config: {
        footer: "",
        buttons: [
          {
            type: "text", //link , call, text
            text: "COMPRAR MAIS",
            action: "1",
          },
          {
            type: "text", //link , call, text
            text: "COMPRAR MENOS",
            action: "2-22",
          },
        ],
      },
    },
    client
  );*/
};

/* API EXPRESS SENDS */

const prizeData = async (req, res, prize_uuid, uuid) => {
  const getPrize = await db.getPrize(prize_uuid);
  if (getPrize !== false) {
    return res.render("prize.ejs", {
      uudi: uuid ? uuid : false,
      data: getPrize[0],
      config: data,
    });
  } else {
    return res.status(200).json({
      status: false,
      message: "Sorteio não encontrado",
    });
  }
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
