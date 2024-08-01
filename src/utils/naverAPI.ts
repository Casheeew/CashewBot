import puppeteer from "puppeteer";
import cheerio from "cheerio";
class API {
    async jpToKr(phrase: string) {
        const uri = 'https://ja.dict.naver.com/#/search?query=' + encodeURIComponent(phrase);
        try {
            const res = await searchjpToKr(uri);
            return res;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                return {
                    query: phrase,
                    found: false,
                };
            }

            throw err;
        }
    }


}

async function searchjpToKr(uri: string) {
    const browser = await puppeteer.launch({ executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
        headless: true });
    const page = await browser.newPage();
    await page.goto(uri, {
        waitUntil: 'networkidle0'
    });

    const wholePage = await page.evaluate(() => {
        const page = document.querySelector("*");
        if (page !== null) return page.outerHTML;
    });

    if (wholePage === undefined) return;
    const $ = cheerio.load(wholePage);

    const tags = $('.mean[lang=ko]')
    let meanings: string[] = []
    tags.each((i, elem) => {
        meanings[i] = $(elem).text().replace(/[\t\n]/g, '');
    })

    await browser.close();
    return meanings
}

export default API;