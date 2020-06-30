import Vue from 'vue';
import Parse from 'parse';
import App from './App.vue';

Vue.config.productionTip = false;

const config = {
	parseAppId: 'WPvUMvCol6gnzTfPTzigy9VHSs27y0R1OD1uEcxW',
	parseApiKey: 'LRxhDRxATNMsdsbpFhJlqrclnMd8RMc3CbTNcNHS'
};

Parse.initialize(config.parseAppId, config.parseApiKey);
Parse.serverURL = 'https://parseapi.back4app.com/';

new Vue({
	render: h => h(App)
}).$mount('#app');
