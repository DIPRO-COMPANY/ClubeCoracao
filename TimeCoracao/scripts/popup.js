function main()
{
    $.ajaxSetup({ cache: false });

    // Gets the stored data in Local Storage and loads the popup.
    // Obtem os dados armazenados na local storage e carrega a popup.
    chrome.extension.sendMessage({ action: "getTeamData" }, function(teamData){ loadPage(teamData); });
}

function loadPage(teamData)
{
    var cssHome = "<link type=\"text/css\" rel=\"stylesheet\" href=\"/estilo/home.css\" id=\"homeCSS\">";
    var cssInfo = "<link type=\"text/css\" rel=\"stylesheet\" href=\"/estilo/info.css\" id=\"infoCSS\">";

    // Removes the css style sheets in the popup html file.
    // Remove as folhas de estilo da popup.html.
    $("#homeCSS").remove();
    $("#infoCSS").remove();

    if(teamData === "")
    {
        $(cssHome).appendTo("head");

        // Load the select teams page and execute the mainHome function inside the home.js.
        // Carrega a página de seleção de times e executa a função mainHome dentro do home.js.
        $("body").load("home.html", function(){ mainHome(); });
    }
    else
    {
        $(cssInfo).appendTo("head");

        // Load the info page about the selected team and execute the mainInfo function inside the info.js.
        // Carrega a página de informação do time e executa a função mainInfo dentro do info.js.
        $("body").load("info.html", function(){ mainInfo(teamData); });
    }
}

// Converts teams names to a phonetic string.
// Converte os nomes dos times para uma string fonética.
function accentInsensitive(text)
{
    text = text.replace(new RegExp(/[ÁÀÂÃáàâã]/gi), "a");
    text = text.replace(new RegExp(/[ÉÈÊéèê]/gi), "e");
    text = text.replace(new RegExp(/[ÍÌÎíìî]/gi), "i");
    text = text.replace(new RegExp(/[ÓÒÔÕóòôõ]/gi), "o");
    text = text.replace(new RegExp(/[ÚÙÛúùû]/gi), "u");
    text = text.replace(new RegExp(/[Çç]/gi), "c");

    return text;
}

// Sets or clears the badge with the team's position in the championship.
// Define ou limpa a badge com a posição do time no campeonato.
function setStatusBadge(name, rank)
{
    chrome.extension.sendMessage(
    {
        action: "setBadge",
        team: name,
        rank: rank
    }, function(){});
}

// Saves the selected team's data.
// Salva os dados do time selecionado.
function saveTeamData(teamData, callback)
{
    chrome.extension.sendMessage(
    {
        action: "saveTeamData",
        teamData: teamData
    }, callback);
}

// Gets HTML data by Ajax request.
// Obtem dados HTML via requisição Ajax.
function getHTML(url, callback)
{
    chrome.extension.sendMessage(
    {
        action: "getHTML",
        url: url
    }, callback);
}

// Gets JSON data, with parse applied, by Ajax request.
// Obtem dados no formato JSON, com o parse aplicado, via requisição Ajax.
function getJSON(url, callback)
{
    chrome.extension.sendMessage(
    {
        action: "getJSON",
        url: url
    }, callback);
}

// Gets data from Local Storage.
// Obtem dados da Local Storage.
function getLSData(id, json, callback)
{
    chrome.extension.sendMessage(
    {
        action: "getLSData",
        id: id,
        json: json
    }, callback);
}

function showLoading(id)
{
    $("<div class=\"loading\"><img src=\"/imagens/loading.gif\" /></div>").appendTo(id);
}

function hideLoading(id)
{
    $(id).find(".loading").remove();
}

// Executes the function main in the pop-up load event.
// Executa a função main quando a popup carrega.
document.addEventListener("DOMContentLoaded", function(){ main(); });