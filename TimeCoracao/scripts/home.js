var teamDataAux;

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

    $("#home-team-select a").click(function()
    {
        var hint = $("#home-hint");

        hint.attr("class", "hint " + teamDataAux.className)
        .fadeOut();
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
        start:0,
        duration:800,
        callback: function(element, index)
        {
            // Exibe o nome do time em foco e armazena seus dados.
            showTeam(teamsListData[index]);

            teamDataAux = teamsListData[index];
        }
    });
}

function showTeam(teamData)
{
    var hint = $("#home-hint");

    hint.attr("class", "click " + teamData.className)
    .html(teamData.phonetic)
    .fadeIn();
}