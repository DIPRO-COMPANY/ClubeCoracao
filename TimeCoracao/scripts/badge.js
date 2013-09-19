function Badge()
{
	this.lider = function()
	{
		chrome.browserAction.setBadgeBackgroundColor({color: "#D9D919"});
		chrome.browserAction.setBadgeText({text: "lider!!!"});
	};

	this.libertadores = function(rank)
	{
		chrome.browserAction.setBadgeBackgroundColor({color: "#0000FF"});
		chrome.browserAction.setBadgeText({text: rank + ""});
	};

	this.neutro = function(rank)
	{
		chrome.browserAction.setBadgeBackgroundColor({color: "#A8A8A8"});
		chrome.browserAction.setBadgeText({text: rank + ""});
	};

	this.rebaixado = function(rank)
	{
		chrome.browserAction.setBadgeBackgroundColor({color: "#A80000"});
		chrome.browserAction.setBadgeText({text: rank + ""});
	};

	this.clear = function()
	{
		chrome.browserAction.setBadgeBackgroundColor({color: ""});
		chrome.browserAction.setBadgeText({text: ""});
	};
}