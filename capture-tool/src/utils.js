module.exports.sleep = function sleep(time) {
	return new Promise(resolve => setTimeout(resolve, time));
};