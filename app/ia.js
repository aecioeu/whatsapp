var { NlpManager } = require("node-nlp"); //natural language processing for chatbot
const manager = new NlpManager({
  languages: ["pt"],
  forceNER: true,
  nlu: { log: false },
});

async function init() {
  //train the chatbot
  manager.addDocument("pt", "ok", "CONFIRMACAO");
  manager.addDocument("pt", "certo", "CONFIRMACAO");
  manager.addDocument("pt", "tudo bem", "CONFIRMACAO");
  manager.addDocument("pt", "blz", "CONFIRMACAO");
  manager.addDocument("pt", "sim", "CONFIRMACAO");
  manager.addDocument("pt", "gostaria", "CONFIRMACAO");
  manager.addDocument("pt", "ativar", "CONFIRMACAO");
  manager.addDocument("pt", "terminei", "CONFIRMACAO");
  manager.addDocument("pt", "acabei", "CONFIRMACAO");
  manager.addDocument("pt", "saber mais", "CONFIRMACAO");
  manager.addDocument("pt", "quero", "CONFIRMACAO");
  manager.addDocument("pt", "aceito", "CONFIRMACAO");

  /**RESPOSTAS  */
  manager.addAnswer("pt", "CONFIRMACAO", {
    resposta: "value",
    value: "text",
  });

  console.log("treinando ...");
  await manager.train();
  console.log("Bot Treinado");
  manager.save();
}

async function intent(findStr) {
  var response = await manager.process("pt", findStr);
  // console.log(response);
  //console.log(typeof(response.answer));
  return response;
}

module.exports = {
  intent,
  init,
};
