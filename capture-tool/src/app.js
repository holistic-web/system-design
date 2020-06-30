const debug = require('debug')('app');
const fs = require('fs');
const { sleep } = require('./utils');
const StreamClient = require('./clients/StreamClient');

const config = {
	streamUrl: 'https://www.youtube.com/watch?v=9Auq9mYxFEE',
	sleepTime: 3500
};

const streamClient = new StreamClient();

// main code block is asynchronous so wrap in a self calling function
(async () => {
	try {
		await streamClient.init();
		await streamClient.loadStream(config.streamUrl);

		while (true) {
			// take the screenshot every 5 seconds
			await sleep(config.sleepTime);
			const imageBuffer = await streamClient.takeScreenshot();

			// write screenshot to disk (for now)
			debug('Writing image to disk...');
			fs.writeFileSync('./screenshot.png', imageBuffer, 'base64');
			debug('Image updated');
		}
	} finally {
		debug('Shutting down...');
		await streamClient.webdriver.quit();
		debug('Finished.');
	}
})();
