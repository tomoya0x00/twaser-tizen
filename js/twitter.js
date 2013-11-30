var TweetHelper = function() {
	var oauth;
};
	
TweetHelper.prototype = {
	authenticate: function(successCallback, errorCallback) {
		var options = {
				// TwitterのAPI情報
				requestTokenUrl : "https://api.twitter.com/oauth/request_token",
				authorizationUrl : "https://api.twitter.com/oauth/authorize",
				accessTokenUrl : "https://api.twitter.com/oauth/access_token",

				// Twitterで登録したアプリのkey/secret
				consumerKey : 'VUiXk3RsGbjRC3G3JpgPXA',
				consumerSecret : 'ESHfE7gC2UjxwmYkGhidCCw7VdPRm5AR9HV4ZuAqY',
		};

		// キャッシュから取得
		var accessTokenStr = localStorage.getItem("accessToken");
		if (accessTokenStr) {
			var accessToken = JSON.parse(accessTokenStr);
			options.accessTokenKey = accessToken.key;
			options.accessTokenSecret = accessToken.secret;
		}
		
		// oauthの新規作成
		oauth = OAuth(options);

		var onerror = function(e) {
			console.error(e)
			oauth.setAccessToken("", "")
			errorCallback && errorCallback(e)
		}
		// 既に認証済みならそのまま返す
		if (oauth.getAccessTokenKey()) {
			console.log(oauth.getAccessTokenKey());
			successCallback && successCallback(oauth);
			return;
		}

		// リクエストトークンの取得
		console.log("fetchRequestToken")
		oauth.fetchRequestToken(function(url) {
			console.log(url)
			// ブラウザで認証画面を表示させる
			var appControl = new tizen.ApplicationControl(
				"http://tizen.org/appcontrol/operation/view", url);
			tizen.application.launchAppControl(appControl)

			// PINコードを入力する画面を用意
			var pin = window.prompt("Please enter your PIN", "");
			oauth.setVerifier(pin);
			oauth.fetchAccessToken(function(e) {
				// キャッシュを保存
				localStorage.setItem("accessToken", JSON.stringify({
					key : oauth.getAccessTokenKey(),
					secret : oauth.getAccessTokenSecret()
				}));
				// コールバック
				successCallback && successCallback(oauth)
			}, onerror);
		}, onerror)
	},
	search: function(keyword, successCallback, errorCallback) {
		oauth && oauth.getJSON("https://api.twitter.com/1.1/search/tweets.json?callback=?&q=" + encodeURIComponent(keyword),
				function(result){
					successCallback && successCallback(result);
					return;
				},
				function(e){
					errorCallback && errorCallback(e);
				});
	}
};

var TweetDisplay = function() {
};

TweetDisplay.prototype = {
		addTweets: function(tweets) {
			$(tweets).each(function(index, item) {
				if(item.text !== undefined) {
					console.log(item.user.screen_name);
					screenname = item.user.screen_name;
					realname = item.user.name;
					tweet = item.text;
					created_at = item.created_at;
					avataar = item.user.profile_image_url;
					created_at = created_at.split(" "); // create list item template
					$("#tweetList").append('<li><img style="margin:1%;" src="'+avataar+'" /><h4>'+screenname+'</h4><p>'+tweet+'</p><p class="light-text">'+created_at[1]+' '+created_at[2]+'</p></li>');
				}
				$("#tweetList").listview("refresh");
			});
		},
		deleteAll: function() {
			$("#tweetList").children().remove();
			$("#tweetList").listview("refresh");
		}
};
