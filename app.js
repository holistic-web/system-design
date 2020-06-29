const puppeteer = require('puppeteer-extra');
const FlashPlugin = require('puppeteer-extra-plugin-flash');

const URL = 'https://live.bilibili.com/?visit_id=6sss3fksb5k0';

// With flash installed
puppeteer.use(FlashPlugin());

function delay(time) {
	return new Promise(function(resolve) {
		setTimeout(resolve, time)
	});
}

(async () => {

	// 1. Launch the browser
	const browser = await puppeteer.launch({});

	// 2. Open a new page
	const page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 })
	// 3. Navigate to URL
	await page.goto(URL, { waitUntil: 'domcontentloaded' });

	// 4. Wait to ensure the page loads
	// delay(5000);

	// 4. Take screenshot
	await page.screenshot({path: 'screenshot.png'});

	await browser.close();

})();