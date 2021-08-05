const fs = require('fs');

const { launchBrowser } = require('./launchBrowser');
const { getFormURL } = require('./src/getFormURL');
const { answerForm } = require('./src/answerForm');

const credentials = JSON.parse(fs.readFileSync('./database/credentials.json'));

;(async () => {
    // Função principal.
    const formLink = await getFormURL(credentials);
    if (formLink.statusCode != '200') return console.log(`Ocorreu um erro durante o login!\nMotivo: ${formLink.response}\nStatus: ${formLink.statusCode}`);
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.goto(formLink.response, { waitUntil: 'networkidle2' });
    const questionsLen = await page.evaluate(() => {
        return document.querySelectorAll('th.row__title').length;
    });

    if (questionsLen == 0) {
        await browser.close();
        return console.log('Você não tem nenhuma atividade pendente.');
    }

    for (i = 0; i < questionsLen; i++) {
        await page.waitForTimeout(1000);
        questionsLeft = await page.evaluate(() => {
            return document.querySelectorAll('th.row__title').length;
        }); 
        console.log(questionsLeft)
        if (questionsLeft > 1) console.log(`${questionsLeft} questões restantes.`)
        else if (questionsLeft == 1) console.log(`Falta apenas 1 questão :D`)
        else if (questionsLeft == 0) break
        await page.click('span.MuiIconButton-label');
        await page.waitForTimeout(300);
        await page.click('button.apply-btn');
        await answerForm(page);
    }

    console.log('Prontinho meu bom, terminei de fazer todas as suas atividaes.')
    await browser.close();
})();