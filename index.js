import pkg from 'request';
const { post } = pkg;
import venom from 'venom-bot'


venom
  .create({
    session: 'session-name', //name of session
    multidevice: true // for version not multidevice use false.(default: true)
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.body[0] === "#" && message.isGroupMsg === false) {
        postData(String(message.body).slice(1, message.body.length), message.from, client)
    }
  });
}

function postData(promptText, nmr, client){
    var openaiApiUrl = 'https://api.openai.com/v1/completions';
    var openaiApiKey = process.env.OPENAI_API_KEY;
    var model = 'text-davinci-003';
    var requestData = {
        model: model,
        prompt: promptText,
        max_tokens: 500,
        temperature: 1
      };
    post({url: openaiApiUrl, json: requestData, headers:{"Authorization": "Bearer " + openaiApiKey}}, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        // Imprima a resposta da API do OpenAI no console
        enviarMensagem(body['choices'][0]['text'], nmr, client);
    }
});}

function enviarMensagem(prompt, nmr, client){
        client
            .sendText(nmr, prompt)
            .then((result) => {
                console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
                console.error('Error when sending: ', erro); //return object error
            });
}
