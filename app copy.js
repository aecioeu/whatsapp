const { default: makeWAclientet, delay, useSingleFileAuthState, DisconnectReason, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage } = require("@adiwajshing/baileys-md")
const { state, saveState } = useSingleFileAuthState('./sessions/auth_info_multi.json')



const client = makeWAclientet({
    auth: state,
    printQRInTerminal: true
})

const sendMessageWTyping = async(msg, jid) => {
    await client.presenceSubscribe(jid)
    await delay(500)
    await client.sendPresenceUpdate('composing', jid)
    await delay(2000)
    await client.sendPresenceUpdate('paused', jid)
    await client.sendMessage(jid, msg)
}

client.ev.on('connection.update', (update) => {
    const { connection } = update
    if(connection === 'close') {
        console.log('closed connection')
    } else if(connection === 'open') {
        console.log('opened connection')
    }
})

//const botNumber = client.user.id.includes(':') ? client.user.id.split(':')[0] + '@s.whatsapp.net' : client.user.id

client.ev.on('messages.upsert', async m => {
    //console.log(JSON.stringify(m, undefined, 2))
    const msg = m.messages[0]
    const body = m.messages[0].message.conversation

    if(!msg.key.fromMe && m.type === 'notify' && body === 'Olá') {
        console.log('Enviando mensagem para: ', m.messages[0].key.remoteJid)
        sendMessageWTyping({ text: 'Oie, tudo bem? Aqui é o Pedrinho da NASA. \n Você já conhece a *COMUNIDADE ZDG?*' }, msg.key.remoteJid)
    } 
    if(!msg.key.fromMe && m.type === 'notify' && body === 'Não') {
        console.log('Enviando mensagem para: ', m.messages[0].key.remoteJid)
        console.log( m.messages[0].message.conversation)
        sendMessageWTyping({ text: ' Nossa comunidade já conta com mais de *250 alunos*.\n\nAcesse agora o conteúdo exclusivo do Método ZDG, todas as soluções apresentadas nesse canal para download imediato, suporte do nosso time e área de membros para tirar dúvidas: https://zapdasgalaxias.com.br \n\n*Quer saber mais alguma coisa?*' }, msg.key.remoteJid)
    }
    if(!msg.key.fromMe && m.type === 'notify' && body === 'Sim') {
        console.log('Enviando mensagem para: ', m.messages[0].key.remoteJid)
        console.log( m.messages[0].message.conversation)
        sendMessageWTyping({ text: ' Então fica ligado que durante essa semana a Comunidade vai estar com um super desconto. \n\n Essa é sua última oportunidade para entrar na turma com o CUPOM DE DESCONTO: *PEDRINHODANASA*' }, msg.key.remoteJid)
    }      

})

client.ev.on('messages.update', m => console.log(m))
client.ev.on('presence.update', m => console.log(m))
client.ev.on('chats.update', m => console.log(m))
client.ev.on('contacts.update', m => console.log(m))

client.ev.on ('creds.update', saveState)
