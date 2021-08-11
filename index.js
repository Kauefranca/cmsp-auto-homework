const prompt = require('prompt-sync')({sigint: true});
const utils = require('./src/utils')

Object.size = function(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

const credentials = { 
  "ra": prompt('Seu RA: '),
  "digit": prompt('Digito do RA: '),
  "uf": "sp",
  "password": prompt('Senha do app CMSP Web: ')
};

;(async () => {
  const { xApiKey, room, statusCode } = await utils.getTokens(credentials);
  if (statusCode != 200) return console.log('\x1b[31m', 'Erro: Usuário não encontrado, verifique suas credenciais e tente novamente.', '\x1b[0m');
  const taskList = await utils.getTasks(xApiKey, room);
  var size = Object.size(taskList);

  if (size <= 0) return console.log('\x1b[31m', 'Não encontrei nenhuma tarefa :/.', '\x1b[0m');
  console.log('\x1b[31m',`${Object.size(taskList)} tarefa(s) encontradas.`, '\x1b[0m');

  for (questionIndex in taskList) {
    await utils.answerTask(taskList[questionIndex].id, xApiKey, room);
    console.log(taskList[questionIndex].title.trim(), '-', '\x1b[32m', 'Concluída ✔️', '\x1b[0m');
  };
})();