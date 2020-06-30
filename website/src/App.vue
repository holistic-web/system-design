<template>
	<div id="app">
		<h1>Test</h1>
	</div>
</template>

<script>
const Parse = require('parse');

const config = {
	screenshotTable: 'StreamInfo',
	parseAppId: 'WPvUMvCol6gnzTfPTzigy9VHSs27y0R1OD1uEcxW',
	parseApiKey: 'LRxhDRxATNMsdsbpFhJlqrclnMd8RMc3CbTNcNHS'
};

export default {
	name: 'App',
	async created() {
		Parse.initialize(config.parseAppId, config.parseApiKey);
		Parse.serverURL = 'https://parseapi.back4app.com/';
		const table = Parse.Object.extend(config.screenshotTable);
		const query = new Parse.Query(table);
		const subscription = await query.subscribe();
		subscription.on('update', update => {
			console.log('update: ', update);
		});
	}
};
</script>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
