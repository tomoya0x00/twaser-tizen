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
	 * つぶやきを検索する
	 * 
	 */
    
	$("#searchButton").click(function(){
	    console.log("oauthButton clicked");
		oauthFunc(function(oauth){
			    console.log("oauthFunc Successed!");
				oauth.getJSON("https://api.twitter.com/1.1/search/tweets.json?callback=?&q=%23githubjp",
						function(data){
							$(data.statuses).each(function(index, item){
								if(item.text !== undefined) {
									console.log(item.user.screen_name);
									screenname = item.user.screen_name;
									realname = item.user.name;
									tweet = item.text;
									created_at = item.created_at;
									avataar = item.user.profile_image_url;
									created_at = created_at.split(" "); // create list item template
									$("#tweetList li:first").append('<li><img style="margin:1%;" src="'+avataar+'" /><h4>'+screenname+'</h4><p>'+tweet+'</p><p class="light-text">'+created_at[1]+' '+created_at[2]+'</p></li>'); 
								}
								$("#tweetList").listview("refresh"); 
							});
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