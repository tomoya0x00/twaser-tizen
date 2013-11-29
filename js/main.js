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
    
	/**
	 * TwitterのOauth認証する
	 * 
	 */
    
	$("#oauthButton").click(function(){
	    console.log("oauthButton clicked");
		oauthFunc(function(oauth){
			    console.log("oauthFunc Successed!");
				oauth.get("https://api.twitter.com/1.1/search/tweets.json?q=%23githubjp",
						function(data){
							console.log(data.text);
						},
						function(e){
							console.log("oauth.get Failed!");
							console.error(e);
						});
			},function(e){
				console.log("oauthFunc Failed!");
				console.error(e);
			});
	});
	
	
};
$(document).bind( 'pageinit', init );
$(document).unload( unregister );