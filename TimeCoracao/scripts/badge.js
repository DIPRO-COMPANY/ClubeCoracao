function Badge(){}

Badge.prototype.setBadge = function(type, rank)
{
    var color = "";
    var text = "";

    switch(type)
    {
        case "lider":
            color = "#D9D919";
            text = "lider";

            break;
        case "libertadores":
            color = "#003394";
            text = rank + "";

            break;
        case "neutro":
            color = "#A8A8A8";
            text = rank + "";

            break;
        case "rebaixado":
            color = "#A80000";
            text = rank + "";

            break;
    }

    chrome.browserAction.setBadgeBackgroundColor({color: color});
    chrome.browserAction.setBadgeText({text: text});
};