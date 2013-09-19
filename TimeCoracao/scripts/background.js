function main()
{
    var teamData =
    {
        "id": 0,
        "name": "",
        "icon": "",
        "globoLink": "",
        "oficialLink": "",
        "className": "",
        "phonetic": ""
    };

    saveTeamData(teamData);

    // Define o ícone do aplicativo em caso de times previamente selecionados com o escudo do time.
    setTeamDefaultIcon(recoverTeamData().icon);
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
        case "setBadge":
         // Define badges com o status do time no campeonato.
            setTeamStatusBadge(request.rank);

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

function setTeamStatusBadge(rank)
{
    if(rank === 0)
    {
        new Badge().clear();
    }
    else if(rank === 1)
    {
        new Badge().lider();
    }
    else if(rank < 5)
        new Badge().libertadores(rank);
    else if(rank < 16)
        new Badge().neutro(rank);
    else if(rank < 20)
        new Badge().rebaixado(rank);
}

function getJSON(url, callback)
{
    getHTML(url, function(htmlData)
    {
        callback(JSON.parse(parseUnicodePtBr(htmlData)));
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
    hexa = "0x" + match.replace(/\\u/, "");

    // Converte o número em hexa para inteiro e pega seu charcode em pt-br.
    return String.fromCharCode(parseInt(hexa));
}

//Escuta as mensagens da popup.
chrome.extension.onMessage.addListener(onMessage);

// Executa a função principal.
main();