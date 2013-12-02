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
	    
    	// 自動更新停止とツイート全削除
	    tweetAutoUpdater.stop();
    	tweetDisplay.deleteAll();
    	
    	// 入力文字があればば検索
	    if(keyword.length > 0) {
	    	tweetHelper.authenticate(function(oauth){
			    console.log("oauthFunc Successed!");
			    tweetHelper.search(keyword, 
		    		function(result) {
			    		// ツイート表示と自動更新開始
		    			tweetDisplay.addTweets(result.statuses);
		    		    tweetAutoUpdater.start(keyword);
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