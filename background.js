var tabUrl;
var tabId;
var globalTimers = {};
var currentState = "active";
var visibilityState = "visible";

setInterval(function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabArray) {

			var tabData = tabArray[0];
			// If the tab isn't valid (usually the chrome console)
			if (tabData == null){
				tabUrl = "none";
			}
			// If the tab is valid, retrieve its url and id
			else{
				tabUrl = tabData.url;
				tabId = tabData.id;
			}

			if (is_google_doc(tabUrl)){
				if (!(tabUrl in globalTimers)){
					globalTimers[tabUrl] = 0;
				}
				
				chrome.idle.queryState(15, function(status){
					currentState = status;
				});
				
				chrome.tabs.sendMessage(tabId, {visibilityRequest: "true"}, function(visibility){
					visibilityState = visibility;
				});

				console.log(visibilityState);
				if(currentState == 'active' && visibilityState == 'visible'){
					globalTimers[tabUrl] += 1;
				}

				chrome.tabs.sendMessage(tabId, {time: globalTimers[tabUrl], state: currentState});

			}

			console.log(globalTimers);


		}
	)}, 1000);

function is_google_doc(tab_url){
	if (tab_url.includes("/edit")){
		return true;
	}
	else {
		return false;
	}
}