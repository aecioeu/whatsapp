// app/routes.js


const ia = require("../helpers/ia");
const db = require("../helpers/db");
const { delay, rand, makeid } = require("../helpers/functions");
const data = require("../config.json");

const fs = require("fs");
const schedule = require("node-schedule");
var moment = require("moment");
moment.locale("pt-br");



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









const router = async function (app, client) {
  const path = require("path");
  const config = require("../config.json");

  app.get("/", function (req, res) {
    res.render(path.join(__dirname + "/../views/index.ejs"), {
      videoId: "test",
    });
  });
  app.get("/saiba-mais.html", function (req, res) {
    console.log(config.comments);
    res.render(path.join(__dirname + "/../views/saiba-mais.ejs"), {
      videoId: config.videoId,
      comments: config.comments,
      total_comments: config.total_comments,
      headline: config.headline,
      headline2: config.headline2,
    });
  });

  app.get("/termos-de-uso.html", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render(path.join(__dirname + "/../views/produto.ejs"));
  });

  app.get("*", function (req, res) {
    res.status(404).send("Erro 404");
  });
};

/*const path = require("path");
const routes = require("express").Router();

const config = require("../config.json");
console.log(config.videoId);

routes.get("/", async function (req, res) {
  console.log("ID:", config.videoId);
  res.render(path.join(__dirname + "/../views/index.ejs"));
});

routes.get("/saber-mais.html", async function (req, res) {
  res.render(
    path.join(__dirname + "/../views/produto.ejs", {
      videoId: config.videoId,
    })
  );
});

module.exports = routes;*/
/*
module.exports = function (app) {
  app.get("/", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render(path.join(__dirname + "/../views/pressell.ejs"));
  });
  app.get("/politica-de-privacidade", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render(path.join(__dirname + "/../views/produto.ejs"));
  });
  app.get("/termos-de-uso", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render(path.join(__dirname + "/../views/produto.ejs"));
  });
  app.get("/:whatever", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render(path.join(__dirname + "/../views/produto.ejs"));
  });
  app.get("/:whatever", function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render(path.join(__dirname + "/../views/produto.ejs"));
  });
  app.get("*", function (req, res) {
    res.status(404).send("Erro 404");
  });
};
*/

module.exports = {
  sendMsg,
  processMessage,
  router
};