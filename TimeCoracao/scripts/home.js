var teamDataAux;
var clickTime = new Date();

function mainHome()
{
    $("#home-hint").click(function()
    {
        // Envia os dados do time escolhido para o background para serem armazenados.
        chrome.extension.sendMessage(
        {
            action: "saveTeamData",
            teamData: teamDataAux
        },
        function(response)
        {
            loadPage(teamDataAux);
        });
    });

    $("#home-team-select a").click(function(event)
    {
        var currentTime = new Date();

        // Impede que novos cliques sejam executados antes do término da animação.
        if(currentTime - clickTime > 500)
            changeTeam($(this), event);

        clickTime = currentTime;
    });

    chrome.extension.sendMessage(
    {
        action: "getJSON",
        url: "/json/times.json"
    },
    function(teamsListData)
    {
        // Recuperada a lista de times via json, popula o carousel, com os escudos dos mesmos.
        populateCarouselHome(teamsListData);

        // Inicia o plugin de carrossel e configura seu callback.
        startCarouselHome(teamsListData);
    });
}

function changeTeam(element, event)
{
    if(!element.hasClass("disabled"))
    {
        $("#home-hint").stop(true, true).attr("class", "hint " + teamDataAux.className);
    }
}

function populateCarouselHome(teamsListData)
{
    var max = teamsListData.length;
    var teamsList = "";

    for(var index = 0; index < max; index++)
    {
        teamsList += "<li><img src=\"/imagens/" + teamsListData[index].icon + "\" /></li>";
    }

    $("ul.overview").append(teamsList);
}

function startCarouselHome(teamsListData)
{
    $("#home-team-select").tinycarousel(
    {
        start: 0,
        duration: 500,
        afterMove: function(element, index)
        {
            // Exibe o nome do time em foco e armazena seus dados.
            showTeamData(teamsListData[index]);
        }
    });
}

function showTeamData(teamData)
{
    $("#home-hint").attr("class", "click " + teamData.className).html(teamData.phonetic);

    teamDataAux = teamData;
}