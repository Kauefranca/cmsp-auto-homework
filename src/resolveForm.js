function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getQuestions(page) {
    const questionsLen = await page.evaluate(() => {
        questionsLen_ = {}
        for (var i = 0; i < document.querySelectorAll('div.question__body').length; i++) {
            questionsLen_[i] = document.querySelectorAll('div.question__body').item(i).querySelectorAll('input[type=radio]').length;
        }
        return questionsLen_
    });
    return questionsLen
}

function sumOfPrevIndexes(obj, target) {
    if (obj[target - 1] === undefined) {
        return 0
    }
    sum = 0
    currentIndex = 1
    while (obj[target - currentIndex] != undefined) {
        sum += obj[target - currentIndex]
        currentIndex += 1
    }
    return sum
}


async function answerForm(page, len) {
    for (i in len) {
        if (len[i] == 0) i += 1
        const ran = (Math.floor(Math.random() * len[i]) + 1) - 1 + sumOfPrevIndexes(len, i)//0 >= n < len[i]
        await page.evaluate((ran) => {
            document.querySelectorAll('input[type=radio]').item(ran).click()
        }, ran);
    }
}

async function resolveForm(page) {
    await sleep(2000)
    const questionsLen = await getQuestions(page);
    await answerForm(page, questionsLen)
    await sleep(1000)
    await page.click('button.fab__submit')
}

module.exports = { resolveForm }