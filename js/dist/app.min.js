(function() {

	var Weather = {
		init: function() {
			this.getLocation();
			this.showTime();
			$('#unit').on('click', this.changeUnit);
			$('#refresh').on('click', this.refresh);
		},

		cache: {
			showFahrenheit: true,
			fahrenheit    : 0,
			celcius       : 0,
			location      : '',
			country       : '',
			icon          : '',
			coverage      : '',
			sunset        : 0,
			sunrise       : 0
		},

		getLocation: function() {
			if ( navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition(this.collectInformation);
			}
		},

		collectInformation: function(position) {
			var c = Weather.cache;

			$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&units=imperial&APPID=3acc16ffae9e45df92a064e41646355f', function(json) {

				c.location = json.name;
				c.country = json.sys.country;
				c.fahrenheit = Math.round(json.main.temp);
				c.celcius = Math.round((c.fahrenheit - 32) * 5 / 9);
				c.icon = json.weather[0].id;
				c.coverage = json.weather[0].main;
				c.sunrise = json.sys.sunrise;
				c.sunset = json.sys.sunset;

				Weather.showMainInformation();
				Weather.showCurrentCoverage();
			});
		},

		showMainInformation: function() {
			var c = Weather.cache;

			// Show Location
			$('#location').html(c.location + ', ' + c.country);
			// Show Temp
			$('#temp').html(c.fahrenheit);
		},

		showCurrentCoverage: function() {
			var c = Weather.cache;
			var currentTime = new Date().getTime() / 1000;

			// Show Day/Night Icon based on current time
			if ( currentTime > c.sunrise && currentTime < c.sunset ) {
				$('#icon').attr('class', 'wi wi-owm-' + c.icon);
			} else {
				$('#icon').attr('class', 'wi wi-owm-night-' + c.icon);
			}

			$('#current').html(Weather.cache.coverage);
		},

		showTime: function() {
			var time = new Date();
			var hours = time.getHours();
			var minutes = time.getMinutes();

			// Display a zero before hours/minutes if below 10
			if ( hours < 10 ) {
				$('#time').html(minutes < 10 ? '0' + hours + ':0' + minutes : '0' + hours + ':' + minutes);
			} else {
				$('#time').html(minutes < 10 ? hours + ':0' + minutes : hours + ':' + minutes);
			}
		},

		changeUnit: function() {
			var c = Weather.cache;

			if ( c.showFahrenheit === false ) {
				$('#temp').html(c.fahrenheit);
				c.showFahrenheit = true;
			} else {
				$('#temp').html(c.celcius);
				c.showFahrenheit = false;
			}

			$('#unit-switch').toggleClass('toggle');
			$('#temp').toggleClass('toggle');
		},

		refresh: function() {
			Weather.showTime();
			Weather.getLocation();
			$('#unit-switch').removeClass('toggle');
			Weather.cache.showFahrenheit = true;
		}
	};

	Weather.init();

})();