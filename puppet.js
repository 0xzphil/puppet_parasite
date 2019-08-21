require('dotenv').config();
const puppeteer = require('puppeteer');

const username = process.env.YUU_USER;
const password = process.env.YUU_PASSWORD;

run().then(r => {
	console.log("First run")
});

async function run() {
	let browser = null;
	let page = null;

	async function check(page) {
		await page.goto('https://auth.garena.com/oauth/login?client_id=200064&response_type=token&redirect_uri=https%3A%2F%2Fthoitrang.bns.garena.vn%2Fconnect%2Fgarena%2Fcallback')
		await page.type('#sso_login_form_account', username);
		await page.type('#sso_login_form_password', password);
		await page.click('#confirm-btn');

		await page.waitForNavigation({waitUntil: "networkidle2"});
		const textOfFirstDiv = await page.evaluate(
			() => document.querySelector('div[class=login] a').textContent
		);

		console.log(textOfFirstDiv);
		// Click "Get" button
		await page.click('.middle');
		// Click "Confirm" button
		await page.click('.swal2-confirm');
	}

	try {
		browser = await puppeteer.launch({headless: true, args:['--no-sandbox']});
		page = await browser.newPage();
		await check(page);
	} catch (e) {
		console.log("ERROR: " + e.toString());
	} finally {
		console.log("Final run");
		await page.close();
		await browser.close();
		setTimeout(run, 300000)
	}
}
