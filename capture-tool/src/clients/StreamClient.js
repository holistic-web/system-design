const debug = require('debug')('StreamClient');
const Webdriver = require('selenium-webdriver');
const { sleep } = require('../utils');

const config = {
	containerId: 'container',
	rootXPath: '/*',
	fullScreenHotkey: 'f',
	premiumPopupXPath: '/html/body/ytd-app/ytd-popup-container/paper-dialog/ytd-mealbar-promo-renderer/div/div[2]/ytd-button-renderer[1]/a/paper-button',
	skipAdvertXPath: '/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[3]/div/ytd-player/div/div/div[4]/div/div[3]/div/div[2]/span/button'
};

/**
 * SteamClient is a client to connect to a youtube stream
 */
module.exports = class StreamClient {

	// configures and opens a Chrome web browser
	async init() {
		debug('Initializing StreamClient...');
		const chromeCapabilities = Webdriver.Capabilities.chrome();
		await chromeCapabilities.set('goog:chromeOptions', { args: ['--start-maximized'] });
		this.webdriver = await new Webdriver.Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
		debug('StreamClient initialized.');
	}

	async loadStream(url) {
		debug(`Navigating to: ${url}...`);
		await this.webdriver.get(url);

		debug(`Interacting with the page to begin playback...`);
		const videoContainer = await this.webdriver.findElement(Webdriver.By.id(config.containerId));
		videoContainer.click();

		debug(`Pressing the 'f' hotkey to enter fullscreen...`);
		const rootElement = await this.webdriver.findElement(Webdriver.By.xpath(config.rootXPath));
		await rootElement.sendKeys('f');

		// wait for the skip advert button, then skip adverts
		debug('Waiting for the skip advert button...');
		await sleep(7500);
		const skipButton = await this.webdriver.findElement(Webdriver.By.xpath(config.skipAdvertXPath));
		if (skipButton) {
			debug('Clicking skip advert button...');
			skipButton.click();
		} else {
			debug('No skip advert button found.');
		}

		// wait for the youtube premium overlay, and then close that
		debug('Waiting for youtube premium overlay...');
		await sleep(1500);
		const overlay = await this.webdriver.findElement(Webdriver.By.xpath(config.premiumPopupXPath));
		if (overlay) {
			debug('Clicking youtube premium overlay...');
			overlay.click();
		} else {
			debug('No youtube overlay found.')
		}

		debug('Stream loaded.')
	}

	async takeScreenshot() {
		debug('Taking a screenshot...');
		const imageBuffer = await this.webdriver.takeScreenshot();
		debug('Screenshot captured.');
		return imageBuffer;
	}

};
