const prompt = require('prompt-sync')({sigint: true});
const utils = require('./src/utils')

const credentials = {
  "ra": prompt('Seu RA: '),
  "digit": prompt('Digito do RA: '),
  "uf": "sp",
  "password": prompt('Senha do app CMSP Web: ')
};

;(async () => {
	const { xApiKey, rooms, statusCode } = await utils.getTokens(credentials);
	if (statusCode != 200) return console.log('\x1b[31m', 'Erro: Usuário não encontrado, verifique suas credenciais e tente novamente.', '\x1b[0m');
	var taskList = [];
	for (let room of rooms) {
		taskList = taskList.concat([], await utils.getTasks(xApiKey, room.name))
	}

	if (taskList.length <= 0) return console.log('\x1b[31m', 'Não encontrei nenhuma tarefa :/', '\x1b[0m');
	console.log('\x1b[31m',`${taskList.length} tarefa(s) encontradas.`, '\x1b[0m');

	for (let task of taskList) {
		await utils.answerTask(task.id, xApiKey, rooms[0].name);
		console.log(task.title.trim(), '-', '\x1b[32m', 'Concluída ✔️', '\x1b[0m');
		utils.sleep(1000)
	};
})();