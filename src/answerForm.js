async function answerForm(page) {
    // Função que responde o formulário.
    await page.waitForTimeout(1000);
    const questions = await page.evaluate(() => {
        return document.querySelectorAll('div.question').length
    });
    for (i = 0; i < questions; i++) {
        const questionLen = await page.evaluate((i) => {
            return document.querySelectorAll('div.question').item(i).querySelectorAll('input.jss8').length;
        }, i);
        const ran = (Math.floor(Math.random() * questionLen) + 1) - 1
        if (questionLen > 0) {
            await page.evaluate(({ ran, i }) => {
                document.querySelectorAll('div.question').item(i).querySelectorAll('input.jss8').item(ran).click()
            }, { ran, i });
        }
    }
    await page.waitForTimeout(500);
    return await page.click('button.fab__submit', { waitUntil: 'networkidle2' })
    // return page.waitForNavigation()
}

module.exports = { answerForm }