$(function(){

	var city = $('.city');
	var twitterLoad = null;
	var twitterPost = null;
	var loc = null;

	/**
	 * Twitter configuration params
	 */

	var twitterParams = {

		consumerKey:'8W2dYaL1YTGifgXdXnvIt67DL',
		consumerKeySecret: '5FExZWVaxI4VA9Luio1O32cmPXPsguNfVdOnjL0WJbdzjEDjj8',
		tokenKey: '15851099-WwYd4O4qK80eURw1BEWASpEvAKw6G6IfS2RSdtQeO',
		tokenKeySecret : 'jURP30WfBs2E681oyczVwJrNzrsJG4OxmjXD169y9PZvW'
	};

	/**
	 * @GetUserLocation to determine user's city with a third party service
	 * if service does not detect city, fall back to Country
	 */

	var	getUserLocation = function(){
		$.get('http://freegeoip.net/json/?q=', function (data) {
			if(data.city != null){
				loc = data.city;
			}
			else{
				loc = data.country;
			}
			city.html('in ' + loc);
			loadTweets();

		}, 'jsonp');
	};

	/**
	 * @LoadTweets given the location and config parameters
	 */

	var loadTweets = function(){
		twitterLoad = new twitterLoader(loc, twitterParams);
	};

	/**
	 * @SetEvents for event listeners
	 */

	var setEvents = function(){
		// Create submit button listener
		$('#sendTweet').click(function(event) {

			tweetText = $(this).parent().find('textarea').val();

			//validate content of textarea
			if (tweetText.length > (140 - loc.length - 11)){
				$('#linkAlert').html('Sorry, your message cointains more than 140 chars').removeClass('hidden');
			}
			//post new tweet if contains a valid youtube link, display loader while the service responds back
			else if (tweetText.toLowerCase().indexOf("youtu") >= 0){
				twitterPost = new twitterPoster( tweetText + ' #NowPlaying ' + loc, twitterParams, function(){
					$.isLoading({ text: "Stay tuned, loading Tweets!" });
					setTimeout(function(){
						loadTweets();
						$.isLoading( "hide" );
					}, 20000);
				});
			}
			//display an error if not
			else{
				$('#linkAlert').html('Oops... please make sure you enter a valid YouTube Link.').removeClass('hidden');
			}
		});
	};

	/**
	 * @constructor
	 */

	var init = function(){
		getUserLocation();
		setEvents();

	}();

	return {};
});
