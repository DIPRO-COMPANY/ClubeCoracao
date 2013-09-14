function Badge()
{
	this.lider = function()
	{
		chrome.browserAction.setBadgeBackgroundColor({color: "#D9D919"});
		chrome.browserAction.setBadgeText({text: "1"});
	};

	this.libertadores = function(position)
	{
		chrome.browserAction.setBadgeBackgroundColor({color: "#0000FF"});
		chrome.browserAction.setBadgeText({text: position + ""});
	};

	this.neutro = function(position)
	{
		chrome.browserAction.setBadgeBackgroundColor({color: "#A8A8A8"});
		chrome.browserAction.setBadgeText({text: position + ""});
	};
	
	this.rebaixado = function(position)
	{
		chrome.browserAction.setBadgeBackgroundColor({color: "#FF0000"});
		chrome.browserAction.setBadgeText({text: position + ""});
	};
}