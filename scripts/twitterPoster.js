var twitterPoster = function(TweetContent, params, sentCallBack){

	var cb = new Codebird;

	/**
	 * @ConfigTwitter set configuration parameters
	 */

	var configTwitter = function(){
		cb.setConsumerKey(params.consumerKey, params.consumerKeySecret);
		cb.setToken(params.tokenKey, params.tokenKeySecret);
	};

	/**
	 * @SendTweet posts a new twitter status and sets a callback function
	 */

	var sendTweet = function(onComplete){
		cb.__call(
   		"statuses_update",
    		{"status": TweetContent},
    		function (reply) {
        		onComplete();
    		}
		);
	};


	/**
	 * @constructor
	 */
	var init = function(){
		void configTwitter();
		void sendTweet(sentCallBack);
	}();

	return {};
};