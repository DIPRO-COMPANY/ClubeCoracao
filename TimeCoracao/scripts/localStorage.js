function LocalStorage(){}

LocalStorage.prototype.set = function(id, value)
{
    localStorage[id] = value;
};
LocalStorage.prototype.get = function(id)
{
    if(id === "libertadoresLastChampion")
        this.set(id, "atletico-mg");

    return localStorage[id];
};
LocalStorage.prototype.getInt = function(id)
{
    var ret = this.get(id);

    return parseInt((ret !== "" ? ret : "0"));
};