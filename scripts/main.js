$(function(){

	var city = $('.city');
	var twitterLoad = null;
	var twitterPost = null;
	var loc = null;

	/**
	 * Twitter configuration params
	 */

	var twitterParams = {

		consumerKey:'gEFEbGdkVTDfzVgyiiCbzUImi',
		consumerKeySecret: 'Q4yQ000AiJL110zoNEkBYL0ASl84SUcnaxkCJ01uZzeghqWeXX',
		tokenKey: '2834545563-3Gp2kIjsN5fFSiph2560NAJanr3WZ6S8pMjzPVU',
		tokenKeySecret : 'iESkAmBbHXWaCHLrkXN89CUyigMMZ5QHboNYsczUDQLlg'
	};

	/**
	 * @GetUserLocation to determine user's city with a third party service
	 * if service does not detect city, fall back to Country
	 */

	var	getUserLocation = function(){
		$.get('http://www.telize.com/geoip?callback=?', function (data) {	
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
