const debug = require('debug')('screenshot-tool');
const screenshot = require('screenshot-desktop');
const fs = require('fs'); // delete me
const { sleep } = require('./utils')

const config = {
    sleepTime: 5000
};

(async () => {
	try {
		debug(`Starting with config: ${JSON.stringify(config, null, '\t')}`);

		while (true) {
			// take the screenshot every 5 seconds
			await sleep(config.sleepTime);
            const imageBuffer = await screenshot();

            // delete me too
            fs.writeFileSync('./screenshot.png', imageBuffer)


            // upload the file to s3 (with a Time To Live)
            // not implemented init

            // send pusher notification with new url
            // not implemented init
		}
	} finally {
		debug('Shutting down...');
	}
})();