const db = require("./db");
const ia = require("./ia");
const { delay } = require("./functions");

const config = require("../config.json");
const questions = require("../questions.json");

const { sendMsg } = require("./senderHelper");
var moment = require("moment");
moment.locale("pt-br");

//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");

//AGENDAMENTOS
const schedule = require("node-schedule");
const { use } = require("express/lib/application");

const processMessage = async (msg, client) => {
  //MARCA A MENSAGEM COMO LIDA
  await client.sendReadReceipt(msg.key.remoteJid, undefined, [msg.key.id]);

  // PASSA A MENSAGEM PARA LETRAS MINUSCULAS
  var mensagem = msg.message.conversation.toLowerCase();

  //console.log(msg)
  console.log(msg.message.templateButtonReplyMessage);

  if (!mensagem) {
    //console.log(msg.message.templateButtonReplyMessage); // null
    if (msg.message.templateButtonReplyMessage != null)
      var buttonId = msg.message.templateButtonReplyMessage.selectedId;
    var mensagem = msg.message.templateButtonReplyMessage.selectedDisplayText;
    console.log(buttonId);
  }

  const intent = await ia.intent(mensagem);
  const user = msg.key.remoteJid.replace(/\D/g, "");

  try {
    const getLead = await db.getLead(user);
    console.log("enviada por ", getLead);
    /*console.log(getLead);*/
    if (getLead == false) {
      // lead não cadastrado
    } else {
      const id = getLead[0].id;
      const stage = getLead[0].stage;
      const fullName = getLead[0].full_name;
      const pix = getLead[0].pixkey;
      const uuid = getLead[0].uuid;
      const currentQuestion = parseFloat(getLead[0].question);
      const name = getLead[0].name.replace(/ .*/, "");
      const conversion_type = getLead[0].conversion_type;
      

      //INFORMAÇÕES SOBRE O PREMIO DO SORTEIO
      //const prizeDate = moment(getPrize[0].prize_end).format("DD-MM-YYYY");

      if (stage == "0") {
        // EXPLICAÇÃO INICIAL
        // se receber uma mensagem em menos de 30 segundos....
        // cancela o Job que envia a mensagem automatica
        const cancelJob = schedule.cancelJob(user);
        if (cancelJob == true)
          console.log(`O job de Remarketing de ${user} foi cancelado`);
        //aceitar qualquer resposta e responde com...
        await sendMsg(
          {
            type: "text",
            message: `${
              conversion_type == "BOT"
                ? `Que bom, *${name}*`
                : `Que bom *${name}*`
            } que você quer saber mais!
              \nEu sou o *João*, assistente virtual 100% automatizado do *GRUPO PNG Pesquisas*, nós somos contratados por _grandes marcas_ para realizar *pesquisas reais* com os consumidores.
      `,
            from: msg.key.remoteJid,
          },
          client
        );
        await delay(5000);
        await sendMsg(
          {
            type: "text",
            message: `*Funciona assim:* Você vai responder algumas perguntas sobre marcas famosas pra gente, aqui mesmo no whatsapp.`,
            from: msg.key.remoteJid,
          },
          client
        );
        await delay(3000);

        await sendMsg(
          {
            type: "text",
            message: `A cada pergunta respondida honestamente pagamos até *R$ ${config.questionValue} para você*, esse valor fica acumulado na sua conta virtual e pode ser sacado quando completar pelo menos *R$ ${config.withdraw} reais*.
            \n*O pagamento* é feito diretamente na *sua chave PIX* e pode ser solicitado *1 vez ao dia*.`,
            from: msg.key.remoteJid,
          },
          client
        );
        await delay(5000);
        await sendMsg(
          {
            type: "button2",
            message: `Para participar do nosso programa de pesquisas você deve atender a *2 requisitos*.
              \n_*1* - Responder honestamente às perguntas da pesquisa_.
              \n_*2* - Ter uma chave PIX para receber seu pagamento_.
               `,
            from: msg.key.remoteJid,
            footer: "",
            buttons: ["ACEITO PARTICIPAR", "NÃO QUERO PARTICIPAR"],
          },
          client
        );

        await db.updateStage(user, 1);
      } else if (stage == "1") {
        // INICIO DO CADASTRO PELO NOME COMPLETO
        if (intent.intent == "CONFIRMACAO") {
          await sendMsg(
            {
              type: "text",
              message: "Ok, vamos fazer um breve cadastro.",
              from: msg.key.remoteJid,
            },
            client
          );

          await delay(2000);

          await sendMsg(
            {
              type: "text",
              message: `*${name}*, qual seu nome completo ?`,
              from: msg.key.remoteJid,
            },
            client
          );

          await db.updateStage(user, 2);

          /* await sendMsg(
              {
                type: "image",
                message: `Olha, você pode ganhar.`,
                from: msg.key.remoteJid,
                config: {
                  file: "./media/1.jpg",
                },
              },
              client
            );

           /* await sendMsg(
              {
                type: "video",
                message: `Como fazer .`,
                from: msg.key.remoteJid,
                config: {
                  jpegThumbnail: "./media/1.jpg",
                  file: "./media/video.mp4",
                },
              },
              client
            );
            await delay(1000);

          
      
            await sendMsg(
              {
                type: "pdf",
                from: msg.key.remoteJid,
                config: {
                  file: "./media/contrato.pdf",
                  filename : `Termo ${name}`
                },
              },
              client
            );*/
          // await db.updateStage(user, 2);
        } else {
        }
      } else if (stage == "2") {
        // VERIFICAÇÃO PELO USUÁRIO DO NOME COMPLETO
        await sendMsg(
          {
            type: "button2",
            message: `Seu nome completo é *${msg.message.conversation}* ?`,
            from: msg.key.remoteJid,
            footer: "",
            buttons: ["CORRETO", "ESCREVER DE NOVO"],
          },
          client
        );

        await db.updateLeadName(user, msg.message.conversation);
        await db.updateStage(user, 3);
      } else if (stage == "3") {
        if (msg.message.templateButtonReplyMessage != null) {
          if (buttonId == 1) {
            await db.updateStage(user, 4);
            //CORRETO
            await processMessage(msg, client);
            //Processa novamente a ultima msg enviada
          }
          if (buttonId == 2) {
            //REPETIR
            await sendMsg(
              {
                type: "text",
                /* message: `Tudo bem ${name}, escreva novamente sua *CHAVE PIX*.
                \nPode ser: *CPF,CELULAR ou CHAVE ALEATÓRIA*`,*/
                message: `Tudo bem *${name}*, escreva novamente o seu *Nome Completo*`,
                from: msg.key.remoteJid,
              },
              client
            );

            await db.updateStage(user, 2);
          }
        } else {
          //ERRO USUARIO RESPODEU EM TEXTO
          await sendMsg(
            {
              type: "text",
              message: `Por favor responda usando os botoes acima 👆`,
              from: msg.key.remoteJid,
            },
            client
          );
        }
      } else if (stage == "4") {
        // INFORME DA CHAVE PIX PARA RECEBER
        await sendMsg(
          {
            type: "text",
            message: `${name}, informe sua chave *CHAVE PIX* para realizarmos os pagamentos.
                \nPode ser: *CPF,CELULAR ou CHAVE ALEATÓRIA*`,
            from: msg.key.remoteJid,
          },
          client
        );

        await db.updateStage(user, 5);
      } else if (stage == "5") {
        // VERIFICACAO PELO USUARIO DA CHAVE PIX
        await sendMsg(
          {
            type: "button2",
            message: `Essa é sua chave pix é *${msg.message.conversation}* ?
            \nConfira com atenção pois *você recebera seus pagamentos nesta CHAVE PIX*.`,
            from: msg.key.remoteJid,
            footer: "",
            buttons: ["CORRETO", "ESCREVER DE NOVO"],
          },
          client
        );

        await db.updateLeadPix(user, msg.message.conversation);
        await db.updateStage(user, 6);
      } else if (stage == "6") {
        if (msg.message.templateButtonReplyMessage != null) {
          if (buttonId == 1) {
            await db.updateStage(user, 7);
            //CORRETO
            await processMessage(msg, client);
            //Processa novamente a ultima msg enviada
          }
          if (buttonId == 2) {
            //REPETIR
            await sendMsg(
              {
                type: "text",
                message: `Tudo bem *${name}*, escreva novamente sua *CHAVE PIX*.
                \nPode ser: *CPF,CELULAR ou CHAVE ALEATÓRIA*`,
                from: msg.key.remoteJid,
              },
              client
            );

            await db.updateStage(user, 5);
          }
        } else {
          //ERRO USUARIO RESPODEU EM TEXTO
          await sendMsg(
            {
              type: "text",
              message: `Por favor responda usando os botoes acima 👆`,
              from: msg.key.remoteJid,
            },
            client
          );
        }
      } else if (stage == "7") {
        // AVISO DE CADASTRO CONCLUIDO
        await sendMsg(
          {
            type: "text",
            message: `${name}, agora que seu cadastro foi *concluido* vou te enviar as perguntas da pesquisa.
            \nLembre-se: Cada resposta honesta adiciona a sua conta *R$ ${config.questionValue}*!!
            \nQuando você tiver pelo menos *R$${config.withdraw} reais* em saldo podera solicitar o *saque para sua Conta PIX* 🙌.
            \nBoa sorte!`,
            from: msg.key.remoteJid,
          },
          client
        );
        await db.updateStage(user, 8);
        await delay(7000);
        await processMessage(msg, client);
      } else if (stage == "8") {
        // PERGUNTAS E SOLICITAÇÃO DE SAQUE
        // console.log("Total de Perguntas da base: ", questions.length);

        const balance = await db.getBalance(user);

        if (currentQuestion >= questions.length || balance >= config.withdraw) {
          //SOLICITAR A TRANSFERENCIA DE VALORES
          await sendMsg(
            {
              type: "button2",
              message: `🥳 *Parabéns ${name}*! Você já pode solicitar a transferencia via *PIX* do valor de *R$ ${balance[0].Total}* 🤑
              \nConfira com atenção pois *você recebera seus pagamentos nesta CHAVE PIX* : ${pix}`,
              from: msg.key.remoteJid,
              footer: "",
              buttons: ["RELIZAR TRANSFERENCIA"],
            },
            client
          );

          await db.updateStage(user, 10);
        } else {
          await db.updateStage(user, 9);

          //FAZER PERGUNTAS

          if (balance[0].Total !== null) {
            await sendMsg(
              {
                type: "text",
                message: `Seu Saldo agora é de *R$ ${balance[0].Total}*.`,
                from: msg.key.remoteJid,
              },
              client
            );
            await delay(500);
          } else {
            await sendMsg(
              {
                type: "text",
                message: `Ao longo das pesquisas eu vou informanto tambem qual o valor do Saldo que você tem.`,
                from: msg.key.remoteJid,
              },
              client
            );
          }

          await sendMsg(
            {
              type: "button2",
              message: `_PERGUNTA nº ${currentQuestion + 1} de ${
                questions.length
              }_\n*${questions[currentQuestion].question}*`,
              from: msg.key.remoteJid,
              footer: `Responda esta pesquisa e receba + R$${config.questionValue}`,
              buttons: questions[currentQuestion].answer,
            },
            client
          );

          //AGENDAR UM LEMBRETE APOS 60 SEGUNDOS
          var date = new Date();
          date.setSeconds(date.getSeconds() + 60);

          schedule.scheduleJob(user, date, async function () {
            //SE O USUARIO NAO RESPONDER O SISTEMA ENVIA UMA MENSAGEM
            await sendMsg(
              {
                type: "text",
                message: `${name} *não demore para responder* as pesquisas e ganhar *+ R$${config.questionValue}* por resposta!! 👆`,
                from: msg.key.remoteJid,
              },
              client
            );
          });
        }

        //await db.updateStage(user, 10);

        //});
      } else if (stage == "9") {
        // TRATAMENTO DAS RESPOSTAS
        schedule.cancelJob(user);
        //RESPONDER PERGUNTAS
        if (msg.message.templateButtonReplyMessage != null) {
          // se detectar que foi uma resposta pelo botão
          await db.updateQuestion(user, currentQuestion + 1);
          await db.insertBalance(user, `${config.questionValue}`);

          //VOLTA PARA AS PERGUNTAS
          await db.updateStage(user, 8);
          await processMessage(msg, client);
        } else {
          //ERRO USUARIO RESPODEU EM TEXTO
          await sendMsg(
            {
              type: "text",
              message: `Por favor responda usando os botoes acima 👆
              \n Sua resposta vale *R$${config.questionValue}*`,
              from: msg.key.remoteJid,
            },
            client
          );
        }
      } else if (stage == "10") {
        // GERAÇAO DO COMPROVANTE DE TRANSFERENCIA PIX

        //PEDIDO PARA REALIZAR TRANSFERENCIA
        if (msg.message.templateButtonReplyMessage != null) {
          //GERAR O COMPROVANTE DE TRANSFERENCIA

          const balance = await db.getBalance(user);

          await sendMsg(
            {
              type: "text",
              message: `So um momento, já estou solicitando *Transferência dos valores*.`,
              from: msg.key.remoteJid,
            },
            client
          );

          // Read HTML Template
          var html = fs.readFileSync("./files/models/pix.html", "utf8");

          await pdf
            .create(
              {
                html: html,
                data: {
                  name: fullName,
                  chave: pix,
                  empresa: config.empresaName,
                },
                path: `./files/pdf/${user}-pix-${name}.pdf`,
                type: "",
              },
              config.pdf
            )
            .then(async (res) => {
              await sendMsg(
                {
                  type: "pdf",
                  from: msg.key.remoteJid,
                  config: {
                    file: `./files/pdf/${user}-pix-${name}.pdf`,
                    filename: `Comprovante Transferência PIX ${name}`,
                  },
                },
                client
              );

              await delay(1000);

              await sendMsg(
                {
                  type: "text",
                  message: `👆 ${name}, deu tudo certo 👍, aqui esta seu comprovante 💰 de agendamento da transferência de R$${balance[0].Total}`,
                  from: msg.key.remoteJid,
                },
                client
              );

              await delay(4000);

              // solicitar o COMPARILHAMENTO

              await sendMsg(
                {
                  type: "button",
                  message: `*⚠️ Para que a sua transferência siga normalmente e *não seja cancelada* pedimos para que você ajude a compartilhar essa ação com alguns amigos.
                  \n*Você tem 5 minutos para concluir essa última etapa!*`,
                  footer: `CLIQUE NO  BOTÃO DE COMPARTILHAR`,
                  from: msg.key.remoteJid,
                  config: {
                    buttons: [
                      {
                        type: "link", //link , call, text
                        text: "COMPARTILHAR",
                        action: config.root + "/s/" + uuid,
                      },
                    ],
                  },
                },
                client
              );

              //um agendamento para conferir quantas vezes foi compartilhado AGUARDA 2 MINUTOS....

              var date = new Date();
              date.setSeconds(date.getSeconds() + 120);
              schedule.scheduleJob(user, date, async function () {
                //SE O USUARIO NAO RESPONDER O SISTEMA ENVIA UMA MENSAGEM

                const shared_times = await db.getLead(user);

                if (shared_times[0].share_count < config.share_numbers) {
                  await sendMsg(
                    {
                      type: "button",
                      message: `${name}, a transferência de  R$${balance[0].Total} está prestes a ser cancelada... Isso, porque você não terminou de compartilhar está ação.!!
                    
                    \nFaltam apenas ${(shared_times[0].share_count - config.share_numbers)} compratilhamentos
                    
                      \n*CALMA QUE AINDA DÁ TEMPO!*`,
                      footer: `NÃO PERCAR ESSA CHANCE! APROVEITE`,
                      from: msg.key.remoteJid,
                      config: {
                        buttons: [
                          {
                            type: "link", //link , call, text
                            text: "COMPARTILHAR",
                            action: config.root + "/s/" + uuid,
                          },
                        ],
                      },
                    },
                    client
                  );
                }
              });
            });
        } else {
          //ERRO USUARIO RESPODEU EM TEXTO
          await sendMsg(
            {
              type: "text",
              message: `Por favor responda usando os botoes acima 👆`,
              from: msg.key.remoteJid,
            },
            client
          );
        }
      } else if (stage == "11") {
       /* const balance = await db.getBalance(user);
      */
     //aguardando a transferencia

     await sendMsg(
      {
        type: "text",
        message: `Calma  ${name}, estamos fazendo a transferência.`,
        from: msg.key.remoteJid,
      },
      client
    );
    
       
      } else if (stage == "12") {

        if (msg.message.templateButtonReplyMessage != null) {
          //INFORMAR O ERRO QUE OCORREU

          if (buttonId == 1) {
           // RECEBI
           await sendMsg(
            {
              type: "text",
              message: `Que bom que deu tudo certo, volte amanhã para responder mais perguntas.`,
              from: msg.key.remoteJid,
            },
            client
          );

          }
          if (buttonId == 2) {
            // ÑAO RECEBI

            await sendMsg(
              {
                type: "text",
                message: `Só um momento vou verificar aqui 🧐.`,
                from: msg.key.remoteJid,
              },
              client
            );

            await delay(3000);

            await sendMsg(
              {
                type: "button",
                message: `${name}, parece que, realmente houve um problema, *seu banco rejeitou* nossa transferência via pix no valor de *R$${balance[0].Total}* 💸.`,
                footer: `Não deixe sua trânsferencia ser cancelada!`,
                from: msg.key.remoteJid,
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

            

           }


          

         
        } else {
          //ERRO USUARIO RESPODEU EM TEXTO
          await sendMsg(
            {
              type: "text",
              message: `Por favor responda usando os botoes acima 👆`,
              from: msg.key.remoteJid,
            },
            client
          );
        }
      } else if (stage == "999") {
      } else {
        // processa a requisição
      }
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  processMessage,
};
