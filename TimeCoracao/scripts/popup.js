function main()
{
    $.ajaxSetup({ cache: false });

    // Recupera os dados armazenados na local storage e carrega a popup de acordo com os dados retornados.
    chrome.extension.sendMessage({ action: "getTeamData" }, function(teamData){ loadPage(teamData); });
}

function loadPage(teamData)
{
    var cssHome = "<link type=\"text/css\" rel=\"stylesheet\" href=\"/estilo/home.css\" id=\"homeCSS\">";
    var cssInfo = "<link type=\"text/css\" rel=\"stylesheet\" href=\"/estilo/info.css\" id=\"infoCSS\">";

    // Remove as folhas de estilo da popup.html.
    $("#homeCSS").remove();
    $("#infoCSS").remove();

    if(teamData.id === 0)
    {
        $(cssHome).appendTo("head");

        // Carrega a página inicial e executa a função mainHome dentro do home.js.
        $("#content").load("home.html", function(){ mainHome(); });
    }
    else
    {
        $(cssInfo).appendTo("head");

        // Carrega a página de informação do time e executa a função mainInfo dentro do info.js.
        $("#content").load("info.html", function(){ mainInfo(teamData); });
    }
}

// Executa a função main sempre que a popup da extensão é aberta.
document.addEventListener("DOMContentLoaded", function(){ main(); });