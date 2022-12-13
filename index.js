// Importe os módulos 'request' e 'fs'
import pkg from 'request';
const { post } = pkg;
// Defina a URL da API do OpenAI
var openaiApiUrl = 'https://api.openai.com/v1/completions';

// Defina sua chave de API do OpenAI
var openaiApiKey = process.env.OPENAI_API_KEY;

// Defina o modelo que deseja usar
var model = 'text-davinci-003';

// Defina a solicitação que deseja enviar à API do OpenAI
var requestData = {
  // Defina o modelo que deseja usar
  model: model,
  // Defina o texto que deseja completar
  prompt: 'Oi, eu sou o OpenAI. Como posso te ajudar?',
  // Defina o número de opções de resposta que deseja receber
  max_tokens: 500
};

// Use o método 'request' para enviar a solicitação à API do OpenAI
post({url: openaiApiUrl, json: requestData, headers:{"Authorization": "Bearer " + openaiApiKey}}, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    // Imprima a resposta da API do OpenAI no console
    console.log(body['choices'][0]['text']);
  }
});
