const {
  default: makeWAclientet,
  delay,
  MessageType,
  MessageOptions,
  Mimetype,
  useSingleFileAuthState,
  DisconnectReason,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  processSenderKeyMessage,
} = require("@adiwajshing/baileys");
const { state, saveState } = useSingleFileAuthState(
  "./sessions/auth_info_multi.json"
);

const P = require("pino") 
//const { rand, makeid } = require("./helpers/functions");
/*const {
  processMessage,
  sendMsg,
  postLeads,
  prizeData,
} = require("./helpers/sender");

*/

const { processMessage } = require("./app/flow");
const { init } = require("./app/ia");

/* INICIANDO SERVIDOR */

const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
//var moment = require("moment");
//moment.locale("pt-br");

const app = express();
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.use(compression());
app.use(express.static(__dirname + "/public"));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectToWhatsApp();






//start("");

async function start(client) {
  app.listen(3000, async function () {
   
   
var fs = require('fs');

if (!fs.existsSync('./sessions')){
    fs.mkdirSync('./sessions', { recursive: true });
}


    await init(); // inicia o treino da IA
    console.log("Servidor Iniciado e escutando na porta 3000");
  });

  require("./app/router.js")(app, client); // load our routes and pass in our app and fully configured passport

  // end start
}

async function connectToWhatsApp() {
  const client = makeWAclientet({
    logger: P({ level: 'debug' }),
    auth: state,
    printQRInTerminal: true,
    version: [2, 2204, 13], 
  });

  await start(client);
  

  client.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "close") {
      console.log("closed connection ");
     
      
      process.exit( );


    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  //const botNumber = client.user.id.includes(':') ? client.user.id.split(':')[0] + '@s.whatsapp.net' : client.user.id

  client.ev.on("messages.upsert", async (m) => {
   // console.log(m)
    const msg = m.messages[0];
    //const type = Object.keys(msg.message)[0];
    //console.log(JSON.stringify(m, undefined, 2))
    /*
      const body = m.messages[0].message.conversation;*/

    //console.log(type, msg);

    //if (!msg.key.fromMe && m.type === "notify" && body === "Olá") {
    if (
      !msg.key.fromMe &&
      m.type === "notify" &&
      m.messages[0].key.remoteJid !== "status@broadcast"
    ) {
      console.log("Enviando mensagem para: ", m.messages[0].key.remoteJid);
      await processMessage(msg, client);
      
    }
  });


  /*client.ev.on("messages.update", (m) => {
    console.log("messageUpdate");
    console.log(m);
  });*/
  //client.ev.on("presence.update", (m) => console.log(m));
  //client.ev.on("chats.update", (m) => console.log(m));
  //client.ev.on("contacts.update", (m) => console.log(m));

  client.ev.on("creds.update", saveState);
}
