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

    $("#home-team-select a").click(function()
    {
        var currentTime = new Date();

        // Impede que novos cliques sejam executados antes do término da animação.
        if(currentTime - clickTime > 500)
        {
            if(!$(this).hasClass("disabled"))
            {
                $("#home-hint").stop(true, true).attr("class", "hint " + teamDataAux.slug);
            }
        }

        clickTime = currentTime;
    });

    getTeamsList(function(teamsListData)
    {
        if(teamsListData !== "error")
        {
            // Recuperada a lista de times via json, popula o carousel com os escudos dos mesmos.
            setTeamsListCarousel(teamsListData);

            $("#home-team-select").attr("class", "");
        }
        else
        {
            $("#home-hint").attr("class", "error").html("erro ao recuperar a lista de times. voce está off-line?");
        }
    });
}

function getTeamsList(callback)
{
    chrome.extension.sendMessage(
    {
        action: "getJSON",
        url: "http://globoesporte.globo.com/dynamo/futebol/campeonato/campeonato-brasileiro/brasileirao2013/classificacao.json"
    },
    function(teamsList)
    {
        var teamsLength = 0;
        var index = 0;
        var newTeamsList = [];

        // Pega a parte do json retornado que lista os times da primeira divisão.
        teamsList = teamsList.lista_de_jogos.campeonato.edicao_campeonato.equipes;

        // Eu preciso criar um array válido com os dados dos times, 20 times no caso.
        while(teamsLength < 20)
        {
            if(teamsList[index] !== undefined)
            {
                newTeamsList.push(teamsList[index]);
                teamsLength = newTeamsList.length;
            }

            index++;
        }

        // Agora eu preciso ordená-lo com base no nome do time e retorná-lo na função de callback.
        newTeamsList.sort(function(valueA, valueB)
        {
            if (valueA.slug > valueB.slug)
                return 1;

            if (valueA.slug < valueB.slug)
                return -1;

            return 0;
          });

        callback(newTeamsList);
    });
}

function setTeamsListCarousel(teamsListData)
{
    var max = teamsListData.length;
    var teamsList = "";

    for(var index = 0; index < max; index++)
    {
        teamsList += "<li><img src=\"" + teamsListData[index].escudo_medio + "\" /></li>";
    }

    $("ul.overview").append(teamsList);

    // 
    $("#home-team-select").tinycarousel(
    {
        duration: 500,
        beforeMove: function(element, index)
        {
            // Exibe o nome do time em foco e armazena seus dados.
            $("#home-hint").attr("class", "click " + teamsListData[index].slug).html(accentInsensitive(teamsListData[index].nome_popular));

            // Cria a propriedade rank com o valor 0.
            teamsListData[index].rank = 0;
            teamsListData[index].officialLink = getOfficialLink(teamsListData[index].slug);
            teamsListData[index].globoLink = "http://globoesporte.globo.com/futebol/times/" + teamsListData[index].slug;

            teamDataAux = teamsListData[index];
        }
    });
}

function getOfficialLink(name)
{
    if(name === "atletico-mg")
        return "http://www.atletico.com.br/site/";
    else if(name === "atletico-pr")
        return "http://www.atleticoparanaense.com/";
    else if(name === "bahia")
        return "http://www.esporteclubebahia.com.br/";
    else if(name === "botafogo")
        return "http://www.botafogo.com.br/";
    else if(name === "coritiba")
        return "http://www.coritiba.com.br/";
    else if(name === "corinthians")
        return "http://www.corinthians.com.br/site/home/";
    else if(name === "criciuma")
        return "http://www.criciumaec.com.br/";
    else if(name === "cruzeiro")
        return "http://www.cruzeiro.com.br/";
    else if(name === "flamengo")
        return "http://www.flamengo.com.br/site/";
    else if(name === "fluminense")
        return "http://www.fluminense.com.br/";
    else if(name === "goias")
        return "http://www.goiasec.com.br/";
    else if(name === "gremio")
        return "http://www.gremio.net/";
    else if(name === "internacional")
        return "http://www.internacional.com.br/";
    else if(name === "nautico")
        return "http://www.nautico-pe.com.br/";
    else if(name === "ponte-preta")
        return "http://pontepreta.com.br/home/";
    else if(name === "portuguesa")
        return "http://www.portuguesa.com.br/";
    else if(name === "santos")
        return "http://www.santosfc.com.br/";
    else if(name === "sao-paulo")
        return "http://www.saopaulofc.net/";
    else if(name === "vasco")
        return "http://www.vasco.com.br/site/";
    else if(name === "vitoria")
        return "http://www.ecvitoria.com.br/";
}