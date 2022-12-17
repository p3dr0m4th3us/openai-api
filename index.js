import pkg from 'request';
const { post } = pkg;
import venom from 'venom-bot'
import fetch from 'node-fetch';
import fs from 'fs'


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
        postData(String(message.body).slice(1, message.body.length), message.from, client, "https://api.openai.com/v1/completions")
    }
    if (message.body[0] === "@" && message.isGroupMsg === false) {
      postData(String(message.body).slice(1, message.body.length), message.from, client, "https://api.openai.com/v1/images/generations")
  }

  });
}

function postData(promptText, nmr, client, url){
    var openaiApiUrl = url;
    var openaiApiKey = process.env.OPENAI_API_KEY;
    var model = 'text-davinci-003';
    if (url == "https://api.openai.com/v1/completions"){
      var imagem = 0
      var requestData = {
        model: model,
        prompt: promptText,
        max_tokens: 3500,
        temperature: 0.9
    };
      post({url: openaiApiUrl, json: requestData, headers:{"Authorization": "Bearer " + openaiApiKey}}, function(error, response, body) {
      if (!error && response.statusCode == 200) {
          // Imprima a resposta da API do OpenAI no console
          enviarMensagem(promptText, String(body['choices'][0]['text']).trim(), nmr, client, imagem);
      }else{
        console.log(body)
        enviarMensagem(promptText, "Algo deu errado! Por favor, aguarde um instante!", nmr, client, imagem);
      }
      });
    }
    if (url == "https://api.openai.com/v1/images/generations"){
      var imagem = 1
      var requestData = {
        prompt: promptText,
        n: 1,
        size: "1024x1024"
    };
      post({url: openaiApiUrl, json: requestData, headers:{"Authorization": "Bearer " + openaiApiKey}}, function(error, response, body) {
      if (!error && response.statusCode == 200) {
          // Imprima a resposta da API do OpenAI no console
          console.log(body)
          enviarMensagem(promptText, body['data'][0]['url'], nmr, client, imagem);
      }else{
        imagem = 0
        console.log(body)
        enviarMensagem(promptText, "#Algo deu errado! Por favor, aguarde um instante!", nmr, client, imagem);
      }
      });
    }
}

async function enviarMensagem(promptUser, prompt, nmr, client, imagem){
        if (imagem == 1){
          var path = './imagensGeradas/imagem-' + String(promptUser).slice(0, 10) + '.png'
          await downloadFile(prompt, path)
          await client
            .sendImage(
              nmr,
              path,
              'image-name'
            )
            .then((result) => {
              console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
              console.error('Error when sending: ', erro); //return object error
            });
        }else{
          client
              .sendText(nmr, prompt)
              .then((result) => {
                  console.log('Result: ', result); //return object success
              })
              .catch((erro) => {
                  console.error('Error when sending: ', erro); //return object error
              });
        }
}

const downloadFile = (async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
});
