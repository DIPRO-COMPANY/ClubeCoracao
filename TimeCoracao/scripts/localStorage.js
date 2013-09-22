function LocalStorage(){}

LocalStorage.prototype.set = function(id, value)
{
    localStorage[id] = value;
};
LocalStorage.prototype.get = function(id)
{
    if(localStorage[id] !== undefined)
    {
        return localStorage[id];
    }
    else
    {
        if(id === "TeamData")
            this.set(id, JSON.stringify(
            {
                "id": 0,
                "name": "",
                "icon": "",
                "globoLink": "",
                "oficialLink": "",
                "className": "",
                "phonetic": "",
                "rank": 0
            }));
        else if(id === "libertadoresLastChampion")
            this.set(id, "atletico-mg");

        return localStorage[id];
    }
};
LocalStorage.prototype.getInt = function(id)
{
    var ret = this.get(id);

    return parseInt((ret !== "" ? ret : "0"));
};