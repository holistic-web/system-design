const fs = require('fs');
// const puppeteer = require('puppeteer');
const ChromeClient = require('./clients/ChromeClient');

const URL = 'https://www.youtube.com/watch?v=9Auq9mYxFEE';
const SKIP_XPATH = '/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[3]/div/ytd-player/div/div/div[4]/div/div[3]/div/div[2]/span/button';
const OVERLAY_XPATH = '/html/body/ytd-app/ytd-popup-container/paper-dialog/ytd-mealbar-promo-renderer/div/div[2]/ytd-button-renderer[1]/a/paper-button';
const SURVEY_XPATH = '//*[@id="button"]'

function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
};

const chromeClient = new ChromeClient();

(async () => {
	try {

		// setup chrome browser
		await chromeClient.build();

		// navigate to the given stream
		await chromeClient.goToURL(URL);

		// get the video container and interact with the page to begin playback
		const videoContainer = await chromeClient.getElementById('container');
		videoContainer.click();

		// use the 'f' hotkey to make the video fullscreen
		const page = await chromeClient.getElementByXpath('/*');
		await page.sendKeys('f');

		// wait for the skip advert button, then skip adverts
		await sleep(7500);
		const skipButton = await chromeClient.getElementByXpath(SKIP_XPATH);
		if (skipButton) skipButton.click();

		// wait for the youtube premium overlay, and then close that
		await sleep(1000);
		const overlay = await chromeClient.getElementByXpath(OVERLAY_XPATH);
		if (overlay) overlay.click();

		// take the screenshot every 5 seconds
		while (true) {
			await sleep(3500);
			const imageBuffer = await chromeClient.takeScreenshot();
			// write screenshot to disk (for now)
			fs.writeFileSync('./screenshot.png', imageBuffer, 'base64');
			console.log('> Updated image...');
		}
	} finally {
		console.log('> Shutting down.');
		chromeClient.quit();
	}
})();