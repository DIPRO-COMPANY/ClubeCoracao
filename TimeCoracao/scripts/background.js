function main()
{
    var teamData = recoverTeamData();

    // Define o ícone do aplicativo em caso de times previamente selecionados com o escudo do time.
    setTeamDefaultIcon(teamData.icon);

    // Define a badge com a posição do time no campeonato.
    setTeamStatusBadge(teamData.className, teamData.rank);
}

// Trata as mensagens entre a popup e o background.
function onMessage(request, sender, sendResponse)
{
    switch(request.action)
    {
        case "saveTeamData":
            // Salva os dados do time selecionado na local storage.
            saveTeamData(request.teamData);

            // Define o ícone da extensão com o escudo do time.
            setTeamDefaultIcon(request.teamData.icon);

            sendResponse(true);

            break;
        case "getJSON":
            // Executa uma chamada XHR e retorna um JSON em formato pt-br.
            getJSON(request.url, sendResponse);

            break;
        case "getHTML":
            // Executa uma chamada XHR e retorna um conteúdo HTML.
            getHTML(request.url, sendResponse);

            break;
        case "getTeamData":
            // Retorna um JSON com os dados armazenados na local storage.
            sendResponse(recoverTeamData());
            break;
        case "getLSData":
            // Retorna alguma informação armazenada na local storage.
            sendResponse(recoverLSData(request.id, request.json));
            break;
        case "setBadge":
         // Define badges com o status do time no campeonato.
            setTeamStatusBadge(request.team, request.rank);

            break;
        default:
    }

    return true;
}

function setTeamDefaultIcon(icon)
{
    chrome.browserAction.setIcon({path: "/imagens/" + icon});
}

function saveTeamData(teamData)
{
    new LocalStorage().set("TeamData", JSON.stringify(teamData));
}

function recoverTeamData()
{
    return JSON.parse(new LocalStorage().get("TeamData"));
}

function recoverLSData(id, json)
{
    var data = new LocalStorage().get(id);
    
    if(json)
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
            callback(xhr.responseText);
        }
        else
        {
            calllback("error");
        }
    };

    xhr.send();
}

function parseUnicodePtBr(data)
{
    // Procura pos caracteres especiais representados em unicode e os converte para o formato pt-br.
    return data.replace(/\\u(\w{4})/g, function(match){ return unicodeToPtBr(match); });
}

function unicodeToPtBr(unicode)
{
    hexa = "0x" + unicode.replace(/\\u/, "");

    // Converte o número em hexa para inteiro e pega seu charcode em pt-br.
    return String.fromCharCode(parseInt(hexa));
}

//Escuta as mensagens da popup.
chrome.extension.onMessage.addListener(onMessage);

// Executa a função principal.
main();