// app/routes.js



/* CONFIGURAÇÕES MERCADO PAGO */

const db = require("./db");
const {makeid} = require("./functions")
const {sendMsg} = require("./senderHelper")
const config = require("../config.json");


const schedule = require("node-schedule");
var got = require("got");
const sharp = require("sharp");

const mercadopago = require("mercadopago");
const mercadoPagoAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const mercadoPagoClientId = process.env.MERCADO_PAGO_CLIENT_ID;

if (!mercadoPagoAccessToken) {
  console.log("Error: access token not defined");
  process.exit(1);
}
mercadopago.configurations.setAccessToken(mercadoPagoAccessToken);

/* CONFIGURAÇÕES MERCADO PAGO */

module.exports = function (app, client) {

  console.log(client.user)
  const path = require("path");
  const config = require("../config.json");

  app.get("/", function (req, res) {
    res.render(path.join(__dirname + "/../views/index.ejs"), {
      videoId: "test",
    });
    
  });




  app.get("/s/:uuid", async function (req, res) {
   
    const ref = req.params.uuid
    let socialproof = ''
    socialproof = await db.getLeadbyUUID(ref)

   
  

    if(socialproof){
    
      const balance = await db.getBalance(socialproof[0].user);
   
   //console.log(config.comments);
    res.render(path.join(__dirname + "/../views/share.ejs"), {
      uuid: ref ? ref : false,
      socialproof: socialproof[0],
      balance: balance[0].Total

    });

  }else{

    return res.status(200).json({
      status: false,
      message: "404 - Não existe",
    });

  }
  });

  
  app.post("/share", async function (req, res, next) {

    const uuid = req.body.uuid;

      lead = await db.getLeadbyUUID(uuid)
 
      if(lead){

      

       

        console.log(lead[0])
        var count = parseFloat(lead[0].share_count) + 1
        await db.updateShareCount(lead[0].user, count)


      if(lead[0].share_count == 7){
        // dispara a conclusao do compartilhamento

        await db.updateStage(lead[0].user, 11);
        const balance = await db.getBalance(lead[0].user);
        await sendMsg(
          {
            type: "text",
            message: `Muito bem ${lead[0].name}, você já compartilhou o suficiente, obrigado por isso! *Seu PIX de R$${balance[0].Total}* está sendo processado agora... aguarde, deve ser compnesado em até 60 segundos na sua conta.`,
            from: lead[0]._serialized,
          },
          client
        );


        var date = new Date();
        date.setSeconds(date.getSeconds() + 60);

        console.log(`O Job de  PIX  para Whastapp ${lead[0].user} foi AGENDADO`);
    
        const job = schedule.scheduleJob(lead[0].user, date, async function () {
          console.log(`O Job de  PIX  para Whastapp ${lead[0].user} foi EXECUTADO`);


          await sendMsg(
            {
              type: "button",
              message: `${lead[0].name}, parece que houve um problma, *seu banco rejeitou* nossa transferência via pix no valor de *R$${balance[0].Total}*.`,
              footer: ``,
              from: lead[0]._serialized,
              config: {
                buttons: [
                  {
                    type: "link", //link , call, text
                    text: "TENTAR NOVAMENTE",
                    action: config.root + "/p/" + uuid,
                  },
                ],
              },
            },
            client
          );
    
          await db.updateStage(lead[0].user, 12);
        });
      
    
        /*await sendMsg(
          {
            type: "button2",
            message: `Seu nome completo é *${msg.message.conversation}* ?`,
            from: msg.key.remoteJid,
            footer: "",
            buttons: ["CORRETO", "ESCREVER DE NOVO"],
          },
          client
        );*/
       

      }
  

   

        return res.status(200).json({
          status: true,
          message: "Existe",
        });

      }else{

        return res.status(200).json({
          status: false,
          message: "Não existe esse Lead",
        });

      }

  


  })

  app.get("/p/:uuid", async function (req, res) {
    //pagina pagamento pix
   
    const ref = req.params.uuid
    let socialproof = ''
    socialproof = await db.getLeadbyUUID(ref)

    if(socialproof){
          const balance = await db.getBalance(socialproof[0].user);
   
   //console.log(config.comments);
    res.render(path.join(__dirname + "/../views/pix.ejs"), {
      uuid: ref ? ref : false,
      socialproof: socialproof[0],
      balance: balance[0].Total

    });


  
  }else{

    return res.status(200).json({
      status: false,
      message: "404 - Não existe",
    });

  }
  });



  app.get("/saiba-mais.html", async function (req, res) {

    //const getLead = await db.getLead('553788555554');
    //console.log(getLead)

    const ref = req.query.ref
    let socialproof = ''

    if(ref){

      socialproof = await db.getLeadbyUUID(ref)

    }

    //console.log(config.comments);
    res.render(path.join(__dirname + "/../views/saiba-mais.ejs"), {
      uudi: ref ? ref : false,
      videoId: config.videoId,
      comments: config.comments,
      total_comments: config.total_comments,
      headline: config.headline,
      headline2: config.headline2,
      socialproof: socialproof
    });
  });

  app.get("/termos-de-uso.html", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render(path.join(__dirname + "/../views/produto.ejs"));
  });



  app.post("/lead", async function (req, res, next) {
    
  const whatsapp = req.body.whatsapp;
  const lead = req.body.name;

  var level = 0,
    reference = 0,
    starter = '',
    profilePic = '',
    uuid = req.body.uuid;

  
  const getLead = await db.getLeadbyUUID(uuid);
  console.log(getLead);

  //existe o numero indicado então ...
  if (getLead !== false) {
    var level = parseInt(getLead[0].level) + 1,
      reference = getLead[0].id;
      starter = getLead[0].starter
    //da o premio de cadastro para a pessoas ...
  }

  //const getPrize = await db.getLead("ABC123");
  //console.log(getPrize);
const makeId = makeid(5)
  // Check if the number exists
  const [result] = await client.onWhatsApp("55" + whatsapp);


  if (typeof result !== 'undefined') {
    console.log(result);
    //{ exists: true, jid: '553788555554@s.whatsapp.net' }    

    try {

      const ppUrl = await client.profilePictureUrl(result.jid)
      console.log(ppUrl)
      const body = await got(ppUrl).buffer();

      await sharp(body)
        .webp()
        .toFormat("webp")
        .resize(128)
        .toFile(`./public/assets/images/leadsPic/${result.jid}.webp`)
        .then(info => { 
          console.log(info)
        })
        .catch(err => {
          console.log(err)
         });
         profilePic = 'TRUE'

        }
        catch (err) {
            // Example error won't be caught here... crashing our app
            // hence the need for domains
            console.log('erro ao obter a imagem')
            profilePic = 'FALSE'
        }

    

 

    const newLead = await db.insertLead(
      result.jid.replace(/\D/g, ""),
      result.jid,
      lead,
      level, //nivel da funil de indicação
      reference, // referencia do usuaio que indicou
      starter ? starter : makeId,
      makeId,
      profilePic
    );

   
    //pegar as indormações do lead apos o cadastro

    const getLead = await db.getLead(result.jid.replace(/\D/g, ""));
    const user = getLead[0].user;
    const _serialized = getLead[0]._serialized;
    const name = getLead[0].name.replace(/ .*/, "");

    console.log(`O Job de ${name} para Whastapp ${user} foi AGENDADO`);

    var date = new Date();
    date.setSeconds(date.getSeconds() + 60);

    const job = schedule.scheduleJob(user, date, async function () {
      console.log(`O Job de ${name} para Whastapp ${user} foi EXECUTADO`);

      await sendMsg(
        {
          type: "button2",
          message: `*${name}*, restam apenas *2 oportunidades para Trabalhar pelo Whatsapp* respondendo pesquisas para grandes marcas,
          \n_COCA-COLA, ELMA CHIPS, BRAMHA entre outras_
          \nVocê pode receber de *R$126 a R$236 reais*. Os pagamentos são feitos por PIX todos os dias.*
          \nGrandes marcas querem saber a opnião de clientes que usam seus produtos e você pode *Lucrar com isso !*

          \nMas atenção! São *vagas limitadas* e apenas poucas pessoas podem participar.
          \nO que você deseja fazer sobre essa oportunidade ?`,
          from: _serialized,
          footer: "",
          buttons: [
            "QUERO SABER MAIS",
            "PASSE MINHA VAGA PARA O PRÓXIMO",
          ],
        },
        client
      );
      await db.updateConversionType(user, "BOT");
    });

    
  } else {
    //numero não existe
    return res.status(200).json({
      status: false,
      message: "Numero não Existe",
    });
    


  }

  return res.status(200).json({
    status: true,
    message: "Cadastro Concluido",
  });
  
  });

  app.post("/getlead", async function (req, res, next) {
    
    const uuid = req.body.uuid;
    const uuidLead = await db.getLeadbyUUID(uuid)
    console.log(uuidLead)

    if(uuidLead[0]){
      return res.status(200).json({
        status: true,
        message: "Lead",
        lead: {
          name : uuidLead[0].name,
          pic: uuidLead[0].pic,
          _serialized: uuidLead[0]._serialized
        }
      });
    }else{
      return res.status(200).json({
        status: false,
        lead: {
          pic: "FALSE"
        }
      });

    }

   
  })

  app.get("*", function (req, res) {
    res.status(404).send("Erro 404");
  });
};

