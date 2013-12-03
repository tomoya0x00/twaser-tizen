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
    
    document.addEventListener('webkitvisibilitychange', onVisibility, false);
    function onVisibility() {
        console.log( document.webkitVisibilityState );
        if (document.hidden || document.webkitHidden) {
            // paused
            console.log("app in background");
        	// 画面消灯防止を解除
        	tizen.power.release("SCREEN");
        }
        else {
            // resumed
            console.log("app in foreground");
            // ツイート自動更新中なら、画面消灯を防止
            if (tweetAutoUpdater.isRunning()) {
	    		// 画面消灯を防止
            	console.log("tizen.power.request");
	    		tizen.power.request("SCREEN", "SCREEN_NORMAL");
            }
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
    	
    	// 画面消灯防止を解除
    	tizen.power.release("SCREEN");
    	
    	// 入力文字があればば検索
	    if(keyword.length > 0) {
	    	tweetHelper.authenticate(function(oauth){
			    console.log("oauthFunc Successed!");
			    tweetHelper.search(keyword, null,
		    		function(result) {
			    		console.log("statuses.length:" + result.statuses.length);
			    		if(0 < result.statuses.length) {
			    			// 取得したツイートがあれば、表示と自動更新開始
			    			tweetDisplay.addTweets(result.statuses);
			    			console.log("since:" + result.statuses[0].id_str);
			    			tweetAutoUpdater.start(keyword, result.statuses[0].id_str);
			    		} else {
			    			// 取得したツイートが無ければ、自動更新だけ開始
			    			tweetAutoUpdater.start(keyword, null);
			    		}
			    		// 画面消灯を防止
			    		tizen.power.request("SCREEN", "SCREEN_NORMAL");
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