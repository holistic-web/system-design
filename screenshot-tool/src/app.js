const debug = require('debug')('screenshot-tool');
const screenshot = require('screenshot-desktop');
const fs = require('fs'); // delete me
const { sleep } = require('./utils');
const AWS = require('aws-sdk');
const Pusher = require('pusher');

const config = {
    sleepTime: 5000
};


const s3Client = new AWS.S3({
    accessKeyId: process.env.S3_ACCESSKEY,
    secretAccessKey: process.env.S3_SECRETACCESSKEY
});


(async () => {
	try {
		debug(`Starting with config: ${JSON.stringify(config, null, '\t')}`);

		while (true) {
			// take the screenshot every 5 seconds
			await sleep(config.sleepTime);
            const imageBuffer = await screenshot();

            //upload buffer with current time appended
            const params = {
                Bucket: 'system-design-photo-collection',
                Key: `imageBuffer_${Date.now()}`,
                Body: imageBuffer
            }

            const stored = await s3Client.upload(params).promise();
            bufferURL = stored.Location;


            // const downloadParams = {
            //     Bucket: bucketName,
            //     Key: filename
            // }

            // const data = await s3Client.getObject(downloadParams).promise();
            // fs.writeFileSync(`./${filename}.png`, data.Body)

            // send pusher notification with new url
            const pusher = new Pusher({
                appId: '1029661',
                key: 'cfa402a8ba9ab9d38c93',
                secret: '09a70a855ed97bf8a9f2',
                cluster: 'eu',
                useTLS: true
            });

            console.log(bufferURL);
            pusher.trigger('system-design', 'url-change', {
                'url': `${bufferURL}`
            });

		}
	} finally {
		debug('Shutting down...');
	}
})();