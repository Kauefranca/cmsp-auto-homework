const readline = require('readline-sync');
const utils = require('./src/utils');

const gradesIndexes = {
	'3 EM SP': '214',
	'2 EM SP': '212',
	'1 EM SP': '213',
	'9 EF SP': '208',
	'8 EF SP': '210',
	'7 EF SP': '202',
	'6 EF SP': '203',
	'5 EF SP': '201',
	'4 EF SP': '218',
	'3 EF SP': '205',
	'2 EF SP': '209',
	'1 EF SP': '217'
}

const credentials = {
  "ra": readline.question('Seu RA: '),
  "digit": readline.question('Digito do RA: '),
  "uf": readline.question('Sigla do seu estado (Ex: sp): '),
  "password": readline.question('Senha do app CMSP Web: ')
};

;(async () => {
	const { xApiKey, grade, rooms, statusCode } = await utils.getTokens(credentials);
	if (statusCode != 200) return console.log('\x1b[31m', 'Erro: Usuário não encontrado, verifique suas credenciais e tente novamente.', '\x1b[0m');
	var taskList = await utils.getTasks(xApiKey, rooms, gradesIndexes[grade]);

	if (taskList.length <= 0) return console.log('\x1b[31m', 'Não encontrei nenhuma tarefa :/', '\x1b[0m');
	console.log('\x1b[31m',`${taskList.length} tarefa(s) encontradas.`, '\x1b[0m');

	for (let task of taskList) {
		await utils.answerTask(task.id, xApiKey, rooms[0].name);
		console.log(task.title.trim(), '-', '\x1b[32m', 'Concluída ✔️', '\x1b[0m');
		utils.sleep(1000)
	};
})();