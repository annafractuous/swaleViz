var App = App || {};

App.CustomParticles = {
	init: function() {
		this.particles = pJSDom[0].pJS.particles;
		
		this.organizeData();
		this.mapDataToParticles();
	},

	organizeData: function() {
		this.tempData = window.towerData.results.map(function(minute) {
			return minute.temperature_f;
		});
		this.humidityData = window.towerData.results.map(function(minute) {
			return minute.humidity_per;
		});
		this.windData = window.towerData.results.map(function(minute) {
			return minute.wind_speed_mph;
		});
	},

	mapDataToParticles: function() {
		var tempCounter = 0;
		var blue = 0;
		var red = 0;
		var speed = 0;
		var size = 0;

		setInterval(function(){
			if (tempCounter < this.tempData.length) {
				tempCounter++;
				red = this.convertRange( this.tempData[tempCounter], [ 50, 110 ], [ 0, 255 ] );
				blue = 250 - red;
				size = this.convertRange( this.humidityData[tempCounter], [ 0, 100 ], [ 0, 7.5 ] );
				speed = this.convertRange( this.windData[tempCounter], [ 0, 11 ], [ 0, 10 ] );
			} else {
				tempCounter = 0;
				blue = 0;
				red = 0;
				speed = 0;
				size = 0;
			}

			this.particles.array.forEach(function(p) { p.radius = size; });
			this.particles.move.speed = speed;
			this.particles.color.rgb = {r: red, g: 0, b: blue};
			if (tempCounter == 1) console.log(this.particles.array[1]);
			this.particles.line_linked.color_rgb_line = {r: 100, g: 100, b: 100};
		}.bind(this), 300)
	},

	convertRange: function(value, r1, r2) {
		return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
	}
}