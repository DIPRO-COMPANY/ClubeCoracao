function main()
{
    var teamData = recoverTeamData();

    if(teamData !== "")
    {
        setTeamDefaultIcon(teamData.escudo_pequeno);

        setTeamStatusBadge(teamData.slug, teamData.rank);
    }
    else
    {
        setTeamDefaultIcon("");

        setTeamStatusBadge("", 0);
    }
}

// Listens for messages between the pop-up and the background.
// Escuta as mensagens entre a popup e o background.
function onMessage(request, sender, sendResponse)
{
    switch(request.action)
    {
        case "saveTeamData":
            saveTeamData(request.teamData);

            if(request.teamData !== "")
                setTeamDefaultIcon(request.teamData.escudo_pequeno);
            else
            {
                setTeamDefaultIcon("");
            }
            sendResponse(true);

            break;
        case "getJSON":
            // Executes a XHR call and returns a JSON in pt-br format.
            // Executa uma chamada XHR e retorna um JSON em formato pt-br.
            getJSON(request.url, sendResponse);

            break;
        case "getHTML":
            // Executes a XHR call and returns a html content.
            // Executa uma chamada XHR e retorna um conteúdo HTML.
            getHTML(request.url, sendResponse);

            break;
        case "getTeamData":
            // Returns a JSON with the stored data in Local Storage.
            // Retorna um JSON com os dados armazenados na local storage.
            sendResponse(recoverTeamData());
            break;
        case "getLSData":
            // Return some information stored in Local Storage
            // Retorna alguma informação armazenada na local storage.
            sendResponse(recoverLSData(request.id, request.json));
            break;
        case "setBadge":
            // Shows a badge with the team's position in the championship.
            // Exibe uma badge com a posição do time no campeonato.
            setTeamStatusBadge(request.team, request.rank);

            break;
        default:
    }

    return true;
}

function setTeamDefaultIcon(icon)
{
    chrome.browserAction.setIcon({ path: (icon === "" ? "/imagens/brasil.png" : icon) });
}

function saveTeamData(teamData)
{
    new LocalStorage().set("TeamData", JSON.stringify(teamData));
}

function recoverTeamData()
{
    data = new LocalStorage().get("TeamData");

    if(data !== undefined)
        return JSON.parse(data);

    return "";
}

function recoverLSData(id, json)
{
    var data = new LocalStorage().get(id);
    
    if(json && data !== undefined)
        return JSON.parse(data);
    else
        return data;
}

function setTeamStatusBadge(name, rank)
{
    var badge = new Badge();

    if(name === new LocalStorage().get("libertadoresLastChampion"))
        badge.setBadge("libertadores", rank);
    else if(rank < 1)
        badge.setBadge("");
    else if(rank === 1)
        badge.setBadge("lider");
    else if(rank < 5)
        badge.setBadge("libertadores", rank);
    else if(rank < 16)
        badge.setBadge("neutro", rank);
    else
        badge.setBadge("rebaixado", rank);
}

function getJSON(url, callback)
{
    getHTML(url, function(responseText)
    {
        if(responseText != undefined)
            callback(JSON.parse(parseUnicodePtBr(responseText)));
        else
            callback("error");
    });
}

function getHTML(url, callback)
{
    var xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);

    xhr.onreadystatechange = function()
    {
        if(xhr.readyState === 4)
        {
            if(xhr.status === 200)
                callback(xhr.responseText);
            else
                callback("error");
        }
    };

    xhr.send();
}

function parseUnicodePtBr(data)
{
    // Search for special characters represented in unicode and convert to the pt-br format.
    // Procura por caracteres especiais representados em unicode e os converte para o formato pt-br.
    return data.replace(/\\u(\w{4})/g, function(match){ return unicodeToPtBr(match); });
}

function unicodeToPtBr(unicode)
{
    hexa = "0x" + unicode.replace(/\\u/, "");

    // Converts the number in hex to integer a gets the charcode in pt-br.
    // Converte o número em hexa para inteiro e pega seu charcode em pt-br.
    return String.fromCharCode(parseInt(hexa));
}

chrome.extension.onMessage.addListener(onMessage);

main();