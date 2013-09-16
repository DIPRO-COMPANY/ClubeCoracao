function LocalStorage()
{
	this.set = function(id, value)
	{
		localStorage[id] = value;
	};	
	this.get = function(id)
	{
		if(localStorage[id] != undefined)
		{
			return localStorage[id];
		}
		else
		{
			return "";
		}
	};
	this.getInt = function(id)
	{
		var ret = this.get(id);

		return parseInt((ret != "" ? ret : "0"));
	};
}