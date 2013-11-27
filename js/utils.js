var oauthFunc = (function() {
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
	var oauth = OAuth(options);

	return function(successCallback, errorCallback) {
		var onerror = function(e) {
			console.error(e)
			oauth.setAccessToken("", "")
			errorCallback && errorCallback(e)
		}
		// 既に認証済みならそのまま返す
		console.log(oauth.getAccessTokenKey());
		if (oauth.getAccessTokenKey()) {
			successCallback && successCallback(oauth);
			return;
		}

		// リクエストトークンの取得
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
	}
})();