var openURL = function(url) {
	console.log(url);

	if(typeof widget != "undefined") {
		// running on emulator
		var appControl = new tizen.ApplicationControl(
				"http://tizen.org/appcontrol/operation/view", url);
		tizen.application.launchAppControl(appControl)
	} else {
		// running on web simulator
		// FIXME:WEBシミュレーターでうまく動かない
		window.open(url, null);
	}
}