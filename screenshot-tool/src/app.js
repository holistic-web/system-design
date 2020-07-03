require('dotenv').config();
const debug = require('debug')('screenshot-tool');
const screenshot = require('screenshot-desktop');
const { v4: uuid } = require('uuid');
const Pusher = require('pusher');
const { sleep } = require('./utils');
const S3Client = require('./S3Client');

const S3 = new S3Client();

const config = {
    sleepTime: 5000
};

const pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: 'eu',
    useTLS: true
});

(async () => {
    try {
        debug(`Starting with config: ${JSON.stringify(config, null, '\t')}`);

        let lastImageName = null;
        while (true) {
            debug(`Sleeping for ${config.sleepTime}...`);
            await sleep(config.sleepTime);

            debug('Taking screenshot...');
            const imageBuffer = await screenshot();

            const imageName = `screenshot-${uuid()}.png`;
            await S3.upload(imageBuffer, imageName);

            const url = S3.getSignedUrl(imageName);

            debug(`Sending pusher notification with ${url}...`);
            await pusher.trigger('system-design', 'screenshot', { url });

            if (lastImageName) {
                await S3.deleteImage(lastImageName);
            }
            lastImageName = imageName;
        }
    } finally {
        debug('Shutting down...');
        await S3.emptyBucket();
    }
})();
