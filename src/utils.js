const axios = require('axios');
const qs = require('qs')

/**
* Get x-api-key and room.
*
* @param {object} credentials
* @returns {object}
*/
exports.getTokens = async (credentials) => {
    var data = qs.stringify({
        realm: 'edusp',
        plataform: 'webclient',
        username: credentials.ra + credentials.digit + credentials.uf,
        password: credentials.password
    })
    const sessionToken = await axios({
        method: 'post',
        url: 'https://cmspweb.ip.tv/',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
        },
        data: data
    }).then((res) => {
        return res.headers['set-cookie'][0].split(';')[0]
    }).catch((err) => err);

    if (sessionToken instanceof Error || !sessionToken.split('=')[1]) return { statusCode: 404 }
    
    const rooms = await axios({
        method: 'post',
        url: 'https://cmspweb.ip.tv/g/getRoomsList',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': sessionToken
        },
        data: 'data=getRoomsList'
    }).then((res) => {
        return res.data
    });

    const info = await axios({
        method: 'post',
        url: 'https://cmspweb.ip.tv/g/getInitial',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': sessionToken
        },
        data: 'data=getInitial'
    }).then((res) => {
        return res.data
    });

    return { xApiKey: info.auth_token, room: rooms.data.rooms[0].name, statusCode: '200' }
};

const TASK_BASE_URL = 'https://edusp-api.ip.tv/tms/task'

/**
* Get object with all tasks.
*
* @param {string} xApiKey
* @param {string} room
* @returns {object}
*/
exports.getTasks = async (xApiKey, room) => {
    const tasks = await axios({
        method: 'get',
        url: `${TASK_BASE_URL}?type=task&publication_target=${room}&publication_target=214&limit=100&offset=0&without_answer=true`,
        headers: {
          'x-api-key': xApiKey
        }
    }).then((res) => {
        return res.data
    });

    return tasks
};

/**
* Get task answer index and question id.
*
* @param {string} taskId
* @param {string} xApiKey
* @returns {object}
*/
getTaskAnswer = async (taskId, xApiKey) => {
    const task = await axios({
        method: 'get',
        url: `https://edusp-api.ip.tv/tms/task/${taskId}?with_questions=true`,
        headers: { 
          'x-api-key': xApiKey
        }
    }).then((res) => {
        return res.data
    });

    var answer = {
        answers: {}
    };

    for (item in task.questions) {
        if (task.questions[item].type == 'single') {
            for (option in task.questions[item].options) {
                answer.questionID = task.questions[item].id
                answer.answers[option] = task.questions[item].options[option].answer
            };
        };
    };
    return answer
};

/**
* Get task answer index and question id.
*
* @param {string} taskId
* @param {string} xApiKey
* @param {string} room
* @returns {object}
*/
exports.answerTask = async (taskId, xApiKey, room) => {
    var { answers, questionID } = await getTaskAnswer(taskId, xApiKey);

    await axios({
        method: 'post',
        url: `https://edusp-api.ip.tv/tms/task/${taskId}/answer`,
        headers: {
            'x-api-key': xApiKey,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            "accessed_on": "room",
            "answers": {
                [questionID]: {
                "answer": answers,
                "question_id": questionID,
                "question_type": "single",
                }
            },
            "duration": getRandomInt(10, 60),
            "executed_on": room
          })
    });
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}