import puppeteer from "puppeteer";
import cheerio from "cheerio";
class API {
    async jpToKr(phrase) {
        const uri = 'https://ja.dict.naver.com/#/search?query=' + encodeURIComponent(phrase);
        try {
            const res = await searchjpToKr(uri);
            return res;
        } catch (err) {
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

async function searchjpToKr(uri) {
    const browser = await puppeteer.launch({ executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
        headless: "new" });
    const page = await browser.newPage();
    await page.goto(uri, {
        waitUntil: 'networkidle0'
    });

    const wholePage = await page.evaluate(() => document.querySelector("*").outerHTML);
    const $ = cheerio.load(wholePage);

    tags = $('.mean[lang=ko]')
    var meanings = []
    tags.each((i, elem) => {
        meanings[i] = $(elem).text().replace(/[\t\n]/g, '');
    })

    await browser.close();
    return meanings
}

export default API;