const debug = require('debug')('S3Client');
const AWS = require('aws-sdk');

const config = {
    imageExpiresAfter: 60 * 60 * 24, // one day
    bucket: {
        name: 'system-design-screenshots',
        region: 'ap-east-1'
    }
};

class S3Client {
    constructor() {
        this.S3 = new AWS.S3({
            accessKeyId: process.env.S3_ACCESSKEY,
            secretAccessKey: process.env.S3_SECRETACCESSKEY,
            region: config.bucket.region
        });
    }

    async upload(imageBuffer, imageName) {
        const params = {
            Bucket: config.bucket.name,
            Key: imageName,
            Body: imageBuffer
        };

        debug(`Uploading ${imageName}...`);
        await this.S3.upload(params).promise();
    }

    getSignedUrl(imageName) {
        const params = {
            Bucket: config.bucket.name,
            Key: imageName,
            Expires: config.imageExpiresAfter
        };
        const url = this.S3.getSignedUrl('getObject', params);
        return url;
    }

    async deleteImage(imageName) {
        const params = {
            Bucket: config.bucket.name,
            Key: imageName
        };
        debug(`Deleting ${imageName}...`);
        await this.S3.deleteObject(params).promise();
    }

    async emptyBucket() {
        const bucketItems = await this.S3.listObjects({
            Bucket: config.bucket.name
        }).promise();

        if (bucketItems.Contents.length === 0) return;

        const params = {
            Bucket: config.bucket.name,
            Delete: { Objects: [] }
        };

        bucketItems.Contents.forEach(({ Key }) => {
            params.Delete.Objects.push({ Key });
        });

        debug('Emptying bucket...');
        await this.S3.deleteObjects(params).promise();
    }
}

module.exports = S3Client;
