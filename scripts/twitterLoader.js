twitterLoader = function(location, params){

	var cb = new Codebird;
	var tweetsContainer = $('#tweetsContainer');

	/**
	 * @ConfigTwitter set configuration parameters
	 */

	var configTwitter = function(){
		cb.setConsumerKey(params.consumerKey, params.consumerKeySecret);
		cb.setToken(params.tokenKey, params.tokenKeySecret);
	};

	/**
	 * @SearchTweets uses a CodeBird object to search for tweets given the parameters
	 */

	var searchTweets = function(){
		var params = {
    		q: '#nowplaying youtube ' + location,
    		count: 10,
		};

		cb.__call(
    		"search_tweets",
    		params,
		    function (reply) {
		    	getYouTubeTweets(reply);
		    	$.isLoading( "hide" );
		    }
		);
	};

	/**
	 * @GetYouTubeTweets parses resulting tweets to find those with youtube links
	 */

	var getYouTubeTweets = function(data){
		var tweetIDs = [];
		$.each(data.statuses, function(i, val){
			var texturl;

			//Get rid of tweets with images instead of videos
			if(data.statuses[i].entities.media == null){

				texturl = data.statuses[i].entities.urls[0].expanded_url;

				if (texturl.toLowerCase().indexOf("youtu") >= 0 ){
					tweetIDs.push(data.statuses[i].id_str);
        		}
			}
    	});

		drawTweets(tweetIDs);
	};

	/**
	 * @DrawTweets get parsed data and populates container using Twitter's widget library, makes sure that at least 6 items
	 * are displayed
	 */

	var drawTweets = function(data){
		tweetsContainer.empty();
		$.each(data, function(i, val) {
			tweetsContainer.append(
				$('<div />').attr('class', 'col-sm-6').append(
					$('<div />').attr('id', 'tweet' + i)
				)
			);

			twttr.ready(function(){
				twttr.widgets.createTweet(val, document.getElementById('tweet' + i));
			});

			if (tweetsContainer.children().length == 6) return false;

    	});
	};

	/**
	 * @constructor
	 */
	var init = function(){
		$.isLoading({ text: "Stay tuned, loading Tweets!" });
		void configTwitter();
		void searchTweets();
	}();

	return {};
};
