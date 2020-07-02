const debug = require('debug')('app');
const fs = require('fs');
const { sleep } = require('./utils');
const ParseClient = require('./clients/ParseClient');
const StreamClient = require('./clients/StreamClient');
const { parse } = require('path');

const config = {
	streamUrl: 'https://www.youtube.com/watch?v=9Auq9mYxFEE',
	sleepTime: 3500,
	screenshotTable: 'StreamInfo',
	screenshotId: '8RAYXgCLZB'
}

const parseClient = new ParseClient();
const streamClient = new StreamClient();

// main code block is asynchronous so wrap in a self calling function
(async () => {
	try {
		debug(`Starting with config: ${JSON.stringify(config, null, '\t')}`);
		await streamClient.init();
		await streamClient.loadStream(config.streamUrl);

		while (true) {
			// take the screenshot every 5 seconds
			await sleep(config.sleepTime);
			const imageBuffer = await streamClient.takeScreenshot();

			await parseClient.updateRecord(
				config.screenshotTable,
				config.screenshotId,
				{ value: imageBuffer }
			);
		}
	} finally {
		debug('Shutting down...');
		if (streamClient.webdriver) await streamClient.webdriver.quit();
	}
})();
