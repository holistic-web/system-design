<template>
	<div id="app">
		<img id="image1" class="screenshot" />
		<img id="image2" class="screenshot" />
	</div>
</template>

<script>
const Pusher = require('pusher-js');

const pusher = new Pusher('b6e39c5d26c10311d144', {
	cluster: 'eu'
});

export default {
	name: 'App',
	data() {
		return {
			currentImage: null,
			nextImage: null
		};
	},
	created() {},
	async mounted() {
		// Get the initial image refs, and set one transparent
		console.log('Setting up...');
		this.currentImage = document.getElementById('image1');
		this.nextImage = document.getElementById('image2');
		this.nextImage.style.opacity = 0;

		// whenever we receive a new screenshot
		const channel = pusher.subscribe('system-design');
		channel.bind('screenshot', (data) => {
			// set the next image's src property to the new url
			const { url } = data;
			console.log(`Loading Image: ${url}...`);
			this.nextImage.src = url;

			// when that data finishes loading
			this.nextImage.onload = () => {
				// switch the opacities of the current and next image
				console.log(`Showing Image: ${url}...`);
				this.nextImage.style.opacity = 100;
				this.currentImage.style.opacity = 0;

				// switch the values so that nextImage is the previous currentImage and vice versa
				const tempImage = this.nextImage;
				this.nextImage = this.currentImage;
				this.currentImage = tempImage;
			};
		});
	}
};
</script>

<style lang="scss">
body {
	margin: 0;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	min-height: 100vh;
}

.screenshot {
	background-position: center;
	background-size: contain;
	background-repeat: no-repeat;
	width: 100%;
	height: auto;
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	transition: 500ms;
}
</style>
