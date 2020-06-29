const Webdriver = require('selenium-webdriver');

async function retry (method, options={}) {
	const defaultOptions = { sleepTime: 500, retries: 20 };
	options = {
		...defaultOptions,
		...options
	};
	let result;
	let error;
	let success = false;
	for (let i=0; i<options.retries; i++) {
		try {
			result = await method();
			success = true;
			break;
		} catch(err) {
			error = err;
		}
		await sleep(options.sleepTime);
	}
	if (success) {
		return result;
	} else {
		throw error;
	}
};

module.exports = class ChromeClient {

	async build() {
		const chromeCapabilities = Webdriver.Capabilities.chrome();
		await chromeCapabilities.set('goog:chromeOptions', { args: ['--start-maximized'] })
		this.webdriver = await new Webdriver.Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
	}

	async getElementByXpath(xpath) {
		const element = await this.webdriver.findElement(Webdriver.By.xpath(xpath));
		return element;
	}

	async getElementById(id) {
		const element = await this.webdriver.findElement(Webdriver.By.id(id));
		return element;
	}

	async getElementsByTagName(tagName) {
		const elements = await this.webdriver.findElement(Webdriver.By.tagName(tagName));
		return elements;
	}

	async getElementsByClass(className) {
		const elements = await this.webdriver.findElements(Webdriver.By.className(className));
		return elements;
	}

	async goToURL(url) {
		await this.webdriver.get(url);
	}

	quit() {
		this.webdriver.quit();
	}

	async takeScreenshot() {
		const imageBuffer = await this.webdriver.takeScreenshot();
		return imageBuffer;
	}

}