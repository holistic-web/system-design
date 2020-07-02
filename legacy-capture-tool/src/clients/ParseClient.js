const debug = require('debug')('ParseClient');
const Parse = require('parse/node');
const axios = require('axios');

const config = {
	appId: process.env.PARSE_APPID,
	apiKey: process.env.PARSE_APIKEY,
	masterKey: process.env.PARSE_MASTERKEY
};

module.exports = class ParseClient {

	constructor() {
		debug('Initialising...')
		Parse.initialize(config.appId, config.apiKey, config.masterKey);
		Parse.serverURL = 'https://parseapi.back4app.com/';
	}

	async updateRecord(tableName, id, update) {
		debug('Updating database record...');
		const table = Parse.Object.extend(tableName);
		const query = new Parse.Query(table);
		const subscription = await query.subscribe();
		// subscription.on('update', update => {
		// 	console.log('update: ', update);
		// });
		const matchingRecord = await query.get(id);
		Object.keys(update).forEach(key => {
			matchingRecord.set(key, update[key]);
		})
		const result = await matchingRecord.save({}, { useMasterKey: true });
		debug('Updated')
		return result;
	}
};