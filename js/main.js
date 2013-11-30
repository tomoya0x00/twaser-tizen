var backEventListener = null;

var unregister = function() {
    if ( backEventListener !== null ) {
        document.removeEventListener( 'tizenhwkey', backEventListener );
        backEventListener = null;
        window.tizen.application.getCurrentApplication().exit();
    }
}

//Initialize function
var init = function () {
    // register once
    if ( backEventListener !== null ) {
        return;
    }
    
    // TODO:: Do your initialization job
    console.log("init() called");
    
    var backEvent = function(e) {
        if ( e.keyName == "back" ) {
            try {
                if ( $.mobile.urlHistory.activeIndex <= 0 ) {
                    // if first page, terminate app
                    unregister();
                } else {
                    // move previous page
                    $.mobile.urlHistory.activeIndex -= 1;
                    $.mobile.urlHistory.clearForward();
                    window.history.back();
                }
            } catch( ex ) {
                unregister();
            }
        }
    }
    
    // add eventListener for tizenhwkey (Back Button)
    document.addEventListener( 'tizenhwkey', backEvent );
    backEventListener = backEvent;
    
    var unregister = function() {
        if ( backEventListener !== null ) {
            document.removeEventListener( 'tizenhwkey', backEventListener );
            backEventListener = null;
            window.tizen.application.getCurrentApplication().exit();
        }
    }
    
	/**
	 * つぶやきを検索する
	 * 
	 */
    
    $("#searchInput").change(function(){
    	var keyword = $(this).val();
	    console.log("searchInput:" + keyword);	    
	    var tweetDisplay = new TweetDisplay();
	    
    	// ツイート全削除
    	tweetDisplay.deleteAll();
    	
    	// 入力文字があればば検索
	    if(keyword.length > 0) {
	    	var tweetHelper = new TweetHelper();
	    	tweetHelper.authenticate(function(oauth){
			    console.log("oauthFunc Successed!");
			    tweetHelper.search(keyword, 
		    		function(result) {
		    			tweetDisplay.addTweets(result.statuses);
		    		},
					function(e){
						console.log("oauth.get Failed!");
						console.error(e);
					});
				},function(e){
					console.log("oauthFunc Failed!");
					console.error(e);
				});
	    }
	});
	
	
};
$(document).bind( 'pageinit', init );
$(document).unload( unregister );