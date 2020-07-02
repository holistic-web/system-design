const debug = require('debug')('screenshot-tool');
const screenshot = require('screenshot-desktop');
const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const Pusher = require('pusher');
const { sleep } = require('./utils');

const config = {
    sleepTime: 5000
};


const s3Client = new AWS.S3({
    accessKeyId: process.env.S3_ACCESSKEY,
    secretAccessKey: process.env.S3_SECRETACCESSKEY
});

const pusher = new Pusher({
    appId: '1029661',
    key: 'cfa402a8ba9ab9d38c93',
    secret: '09a70a855ed97bf8a9f2',
    cluster: 'eu',
    useTLS: true
});


(async () => {
	try {
		debug(`Starting with config: ${JSON.stringify(config, null, '\t')}`);

        let lastImageName = null;
		while (true) {
			// take the screenshot every 5 seconds
			await sleep(config.sleepTime);
            const imageBuffer = await screenshot();

            //upload buffer with current time appended
            const imageName =  `screenshot-${uuid()}.png`;
            const { url: Location } = await s3Client.upload({
                Bucket: 'system-design-photo-collection',
                Key: imageName,
                Body: imageBuffer
            }).promise();

            // send pusher notification with new url
            await pusher.trigger('system-design', 'url-change', { url });

            if (lastImageName) {
                // TODO: delete the old image
            }
            lastImageName = imageName;
		}
	} finally {
        debug('Shutting down...');
        // empty the s3 bucket
	}
})();