const puppeteer = require("puppeteer"),
    fs = require("fs-extra"),
    cookies = require("./cookies"); //log into facebook and paste all your cookies here

//regexes to match the things we're looking for
const regexMail = /[^\s@]+@[^\s@]+\.[^\s@]+/,
      regexPhone = /\(\d{2,}\) \d{4,}\-\d{4}/,
      regexNasc1 = /\d+\sde\s\D+\sde\s\d+/,
      regexNasc2 = /\d+\sde\s[^\s]+/,
      regexLinkedIn = /https%3A%2F%2Flinkedin\.com%2Fin%2F[^%]+/,
      regexInstagram = /https%3A%2F%2Finstagram\.com%2F[^%]+/,
      regexTwitter = /https%3A%2F%2Ftwitter\.com%2F[^%]+/;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

(async function main() {

    try {
        const browser = await puppeteer.launch({
                headless: false
            }),
              page = await browser.newPage();

        //use your actual User Agent so Facebook won't trigger any authentication issues
        page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106");

        await page.setCookie(...cookies);

        const content = await fs.readFile("./output/linksList.json", "utf8"),
              obj = await JSON.parse(content);

        //variable to manipulate the array later without interfering on the for loop
        let obj2 = await JSON.parse(content);

        await fs.readFile("./output/profilesList.csv", "utf8", async (err, data) => {
            if (err) await fs.writeFile("./output/profilesList.csv", "nome,link,email,telefone,nasc,linkedin,instagram,twitter\n");
        });

        for (let i = 0; i < obj.length; i++) {
            let url;
            let url2;

            if (obj[i].link.includes("?ref=br_rs")) {
                url = await obj[i].link.replace("?ref=br_rs", "/about?section=contact-info");
                url2 = await obj[i].link.substring(0, obj[i].link.indexOf('?'));
            } else {
                url = await obj[i].link.replace("&ref=br_rs", "&sk=about&section=contact-info");
                url2 = await obj[i].link.substring(0, obj[i].link.indexOf('&'));
            }

            //don't be so fast! Facebook will block you
            await new Promise((resolve, reject) => {
                setTimeout(async () => {
                    await page.goto(url);
                    console.log(`Scrapping profile ${i + 1} of ${obj.length + 1}`)
                    resolve();
                }, getRandomInt(10000, 60000));
            }).catch( error => console.log("setTimeout", error ) )

            await page.waitForSelector("#pagelet_contact");

            let bodyText = await page.evaluate(() => document.body.innerText),
                bodyHTML = await page.evaluate(() => document.getElementById("pagelet_contact").innerHTML),
                name = await page.evaluate(() => document.getElementById("fb-timeline-cover-name").innerText),

                email = await bodyText.match(regexMail),
                phone = await bodyText.match(regexPhone),
                nasc = await bodyText.match(regexNasc1) ? bodyText.match(regexNasc1) : bodyText.match(regexNasc2),
                linkedin = await decodeURIComponent(bodyHTML.match(regexLinkedIn)),
                instagram = await decodeURIComponent(bodyHTML.match(regexInstagram)),
                twitter = await decodeURIComponent(bodyHTML.match(regexTwitter));

            //removing object from the array so we can start from where we were blocked
            await obj2.shift();
            await fs.writeFile("./output/linksList.json", JSON.stringify(obj2))

            await fs.appendFile("./output/profilesList.csv", `${name},${url2},${email},${phone},${nasc},${linkedin},${instagram},${twitter}\n`)
        }

        console.log("done");
        await browser.close();

    } catch (err) {
        console.error(err)
    }
})()