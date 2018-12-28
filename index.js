const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const cookies = require("./cookies"); //log into facebook and paste all your cookies here

(async function main() {

    try {
        const browser = await puppeteer.launch({
            headless: true
        });
        const page = await browser.newPage();

        //use your actual User Agent so Facebook won't trigger any authentication issues
        page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106");

        await page.setCookie(...cookies);

        const url = "https://www.facebook.com/search/364721450401244/likers/females/110346955653479/residents-near/present/intersect/";
        const nameSelector = "._32mo" //selector that contains our data
        let jsonOutput = new Array;


        await page.goto(url);
        await page.waitForSelector(nameSelector);

        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    window.scrollBy(0, 200000)
                    if (document.querySelector("#browse_end_of_results_footer")) { //this is the element that shows when the search results are over
                        clearInterval(interval)
                        resolve()
                    }
                }, 500)
            })
        })

        const names = await page.$$(nameSelector);

        for (let i = 0; i < names.length; i++) {

            const name = names[i];
            const url = await page.evaluate(name => name.href, name);

            jsonOutput[i] = {
                "link": url
            }
        }
        await fs.writeFile("./output/linksList.json", JSON.stringify(jsonOutput))

        console.log("done");

        await browser.close();

    } catch (err) {
        console.error(err)
    }
})();