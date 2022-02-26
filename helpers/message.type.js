/*ARQUIVO QUE REGULA O MODELO DE MENSAGNES */

const { config } = require("dotenv");

//MENSAGEM DE TEXTO
sendMsg(
  {
    type: "text",
    message: "Olá msg automática",
    from: msg.key.remoteJid,
  },
  client
);

sendMsg(
  {
    type: "image",
    message: "Olá msg automática",
    from: msg.key.remoteJid,
    config: {
      url: "./1.jpg",
    },
  },
  client
);

sendMsg(
  {
    type: "video",
    message: "Olá msg automática",
    from: msg.key.remoteJid,
    config: {
      url: "./video.mp4",
    },
  },
  client
);

sendMsg(
  {
    type: "audio",
    from: msg.key.remoteJid,
    config: {
      url: "./1.ogg",
      //mensagem gravada diretamente no whatsapp e depois baixada
    },
  },
  client
);

sendMsg(
  {
    type: "pdf",
    from: msg.key.remoteJid,
    config: {
      url: "./media/contrato.pdf",
      //mensagem gravada diretamente no whatsapp e depois baixada
    },
  },
  client
);

sendMsg(
  {
    type: "button",
    message: "Olá msg automática",
    footer: "",
    from: msg.key.remoteJid,
    config: {
      buttons: [
        {
          type: "link", //link , call, text
          text: "texto do botão",
          action: "https://google.com.br",
        },
        {
          type: "call", //link , call, text
          text: "texto do botão",
          action: "+1 (234) 5678-901",
        },
        {
          type: "text", //link , call, text
          text: "texto do botão",
          action: "1",
        },
      ],
    },
  },
  client
);

/*const templateButtons = [
        {
          index: 1,
          urlButton: {
            displayText: "⭐ Star Baileys on GitHub!",
            url: "https://github.com/adiwajshing/Baileys",
          },
        },
        {
          index: 2,
          callButton: {
            displayText: "Call me!",
            phoneNumber: "+1 (234) 5678-901",
          },
        },
        {
          index: 3,
          quickReplyButton: {
            displayText: "This is a reply, just like normal buttons!",
            id: "id-like-buttons-message",
          },
        },
      ];

      const templateMessage = {
        text: "Hi it's a template message",
        footer: "Hello World",
        templateButtons: templateButtons,
      };

      const sendMsg = await client.sendMessage(payload.from, templateMessage);*/
