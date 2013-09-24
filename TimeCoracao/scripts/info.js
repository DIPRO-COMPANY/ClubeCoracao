function mainInfo(teamData)
{
    // Configura o layout da página com os dados do time escolhido.
    setTeamBasicInformation(teamData);

    // Busca as últimas notícias de highlight sobre o time em formato json.
    getLatestNews(teamData.slug, function(latestNews)
    {
        setCarouselLatestNews(latestNews);
    });

    // Recupera a tabela de classificação no formato json, trata e exibe as informações na popup.
    getLeaderBoard(function(leaderBoard)
    {
        var rank = getTeamRank(leaderBoard, teamData.slug);

        teamData.rank = rank;

        // Armazena a posição do time na local storage.
        chrome.extension.sendMessage(
        {
            action: "saveTeamData",
            teamData: teamData
        }, function(response){});

        // Preenche a tabela de classificação reduzida contendo o time escolhido mais três outros times.
        populateLeaderBoardContainer(leaderBoard, rank);

        // Busca a posição do time e seta as informações dependentes como a badge de status e a imagem de lider.
        showTeamRanking(rank, teamData.slug);
    });

    // Busca as últimas partidas do time em formato json.
    getLatestMatchs(teamData.slug, function(latestMatchs)
    {
        setCarouselLatestMatchs(latestMatchs);
    });
}

function setTeamBasicInformation(teamData)
{
    // Insere o css do time selecionado.
    $("<link type=\"text/css\" rel=\"stylesheet\" href=\"/estilo/times/" + teamData.slug + ".css\">").appendTo("head");

    // Define o escudo do time.
    $("#team-streamer").css("background-image", "url(" + teamData.escudo_medio + ")");

    // Define o título.
    $("p.page-title").html(accentInsensitive(teamData.nome_popular));

    // Define os links de acesso externo do topo.
    $("#link-globo").attr("href", teamData.globoLink).html(teamData.nome_popular + " na globo");
    $("#link-oficial").attr("href", teamData.officialLink);
}

function getLatestNews(name, callback)
{
    // Esse não tem json vai ter que ser na base do scraping mesmo.
    chrome.extension.sendMessage(
    {
        action: "getHTML",
        url: "http://globoesporte.globo.com/futebol/times/" + name + "/"
    },
    function(htmlData)
    {
        var latestNews = [];

        // Extrai as informações do html buscado e monta um json com os dados formatados.
        $(htmlData).find(".conteudo-extra").each(function()
        {
            title = $(this).find("a:last .globo-carrossel-titulo-texto").html();
            align = ($(this).find(".destaque-carrossel").attr("class").indexOf("right") > -1 ? "align-right" : "align-left");
            subtitle = $(this).find("a:last .globo-carrossel-subtitulo-texto").html();
            link = $(this).find("a:last").attr("href");
            image = $(this).find("img").attr("src");

            latestNews.push(
            {
                title: (title === undefined ? "" : title).replace(/(<([^>]+)>)/ig," ").replace(/\s+/, ""),
                align: (align === undefined ? "align-left" : align),
                subtitle: (subtitle === undefined ? "" : subtitle).replace(/(<([^>]+)>)/ig," ").replace(/\s+/, ""),
                link: (link === undefined ? "" : link),
                image: (image === undefined ? "" : image)
            });
        });

        callback(latestNews);
    });
}

function setCarouselLatestNews(latestNews)
{
    var newsViewList = "";
    var newsPagerList = "";
    var max = latestNews.length;

    max = (max < 3 ? max : 3);

    // Independente do total de notícias, exibe apenas 3.
    for(var index = 0; index < max; index++)
    {
        newsViewList += "<div class=\"overview-item\">\n \
                             <a href=\"" + latestNews[index].link + "\" target=\"new\">\n \
                                 <span class=\"highlight " + latestNews[index].align + "\">" + latestNews[index].title + "</span>\n \
                                 <img src=\"" + latestNews[index].image + "\" />\n \
                                 <span class=\"sub-text\">" + latestNews[index].subtitle + "</span>\n \
                             </a>\n \
                         </div>";

        newsPagerList += "<div class=\"pager-item\">\n \
                              <img class=\"pager-seta\" src=\"/imagens/seta.png\" />\n \
                              <a rel=\"" + index + "\" class=\"pager-link\" href=\"#\">\n \
                                  <div class=\"pager-title\">" + latestNews[index].title + "</div>\n \
                                  <div class=\"pager-mask\"></div>\n \
                                  <img class=\"pager-ativo\" src=\"/imagens/circle.png\" />\n \
                                  <img class=\"pager-foto\" src=\"" + latestNews[index].image + "\" />\n \
                              </a>\n \
                          </div>";
    }

    $("#info-latest-news .overview").append(newsViewList);
    $("#info-latest-news .pager").append(newsPagerList);

    $("#info-latest-news").tinycarousel(
    {
        start: 0,
        duration: 600,
        controls: false,
        pager: true,
        interval: true,
        intervaltime: 5000,
        fixedPageWidth: 450,
        fixedViewWidth: 330,
        UseViewSize: true,
        beforeMove: function(element, index)
        {
            $("img.pager-ativo").attr("class", "pager-ativo");
            $("a[rel='" + index + "']").find("img.pager-ativo").attr("class", "pager-ativo display-block");
        }
    });
}

function getLeaderBoard(callback)
{
    chrome.extension.sendMessage(
    {
        action: "getJSON",
        url: "http://globoesporte.globo.com/dynamo/futebol/campeonato/campeonato-brasileiro/brasileirao2013/classificacao.json"
    },
    function(leaderBoard)
    {
        // Passa a parte do json com a classificação do campeonato.
        callback(leaderBoard.edicao_campeonato.fases[0].pontos_corridos_simples[0].classificacoes[0]);
    });
}

function getTeamRank(leaderBoard, name)
{
    var max = leaderBoard.classificacao.length;
    var rank = 0;

    // Busca a posição do time do campeonato.
    for(var index = 0; index < max; index++)
    {
        if(leaderBoard.classificacao[index].slug === name)
        {
            rank = leaderBoard.classificacao[index].ordem;
            break;
        }
    }

    return rank;
}

function showTeamRanking(rank, name)
{
    chrome.extension.sendMessage(
    {
        action: "setBadge",
        team: name,
        rank: rank
    }, function(){});

    if(rank === 1)
       $("#team-leader").attr("class", "display-block");
}

function populateLeaderBoardContainer(leaderBoard, rank)
{
    var iniPosition = 0;
    var endPosition = 0;
    var teamRankingRows = "";
    var groupClass = "";

    rank--;

    if(rank > 3 && rank < 16)
        iniPosition = rank - 2;
    else if(rank > 15)
        iniPosition = 16;

    endPosition = iniPosition + 4;

    chrome.extension.sendMessage(
    {
        action: "getLSData",
        id: "libertadoresLastChampion",
        json: false
    }, function(libertadoresLastChampion)
    {
        for(var index = iniPosition; index < endPosition; index++)
        {
            if(index < 4)
                groupClass = "libertadores";
            else if(rank < 16)
                groupClass = "neutro";
            else
                groupClass = "rebaixado";

            if(leaderBoard.classificacao[index].slug === libertadoresLastChampion)
                groupClass = "libertadores";

            teamRankingRows += "<tr>\n \
                                    <td class=\"ranking " + groupClass + "\">" + leaderBoard.classificacao[index].ordem + "</td>\n \
                                    <td class=\"name text-bold" + (rank === index ? " team-color": "") + "\">" + leaderBoard.classificacao[index].nome_popular + "</td>\n \
                                    <td class=\"score team-color\">" + leaderBoard.classificacao[index].pontos + "</td>\n \
                                    <td class=\"match team-color\">" + leaderBoard.classificacao[index].jogos + "</td>\n \
                                    <td class=\"win team-color\">" + leaderBoard.classificacao[index].vitorias + "</td>n\ \
                                    <td class=\"draw text-bold\">" + leaderBoard.classificacao[index].empates + "</td>\n \
                                    <td class=\"defeat text-bold\">" + leaderBoard.classificacao[index].derrotas + "</td>\n \
                                    <td class=\"goals-pro text-bold\">" + leaderBoard.classificacao[index].gols_pro + "</td>\n \
                                    <td class=\"goals-agin text-bold\">" + leaderBoard.classificacao[index].gols_contra + "</td>\n \
                                    <td class=\"goals-difference text-bold\">" + leaderBoard.classificacao[index].saldo_gols + "</td>\n \
                                    <td class=\"productivity team-color\">" + leaderBoard.classificacao[index].aproveitamento + "</td>\n \
                                </tr>";
        }
    
        $("#leaderboard tbody").html(teamRankingRows);
    });
}

function getLatestMatchs(name, callback)
{
    chrome.extension.sendMessage(
    {
        action: "getJSON",
        url: "http://globoesporte.globo.com/dynamo/futebol/time/" + name + "/listadejogos.json"
    },
    function(latestMatchs)
    {
        callback(latestMatchs);
    });
}

function setCarouselLatestMatchs(latestMatchs)
{
    var matchsList = "";
    var max = latestMatchs.length;
    var matchDateTime;
    var displayBlock;
    var startPosition = 0;

    for(var index = 0; index < max; index++)
    {
        matchDateTime = getMatchDateTime(latestMatchs[index].datajogo, latestMatchs[index].horajogo);

        if(new Date(matchDateTime) < new Date())
            displayBlock = " display-block";
        else
        {
            if(startPosition === 0)
                startPosition++;

            displayBlock = "";
        }

        matchDateTime = formatMatchDateTime(matchDateTime);

        if(latestMatchs[index].slug_campeonato === "campeonato-brasileiro")
        {
            matchsList += "<div class=\"overview-item\">\n \
                               <div id=\"info-home\"><img title=\"mandante\" src=\"http://s.glbimg.com/es/ge/f/" + latestMatchs[index].escudo_mandante.pequeno + "\" alt=\"\" title=\"\" /></div>\n \
                               <p id=\"home-score\" class=\"text-score" + displayBlock + "\">" + latestMatchs[index].placar_oficial_mandante + "</p>\n \
                               <div id=\"info-versus\"></div>\n \
                               <p id=\"visitants-score\" class=\"text-score" + displayBlock + "\">" + latestMatchs[index].placar_oficial_visitante + "</p>\n \
                               <div id=\"info-visitants\"><img title=\"visitante\" src=\"http://s.glbimg.com/es/ge/f/" + latestMatchs[index].escudo_visitante.pequeno + "\" alt=\"\" title=\"\" /></div>\n \
                               <p class=\"text-bold\">" + latestMatchs[index].nome_campeonato + (!isNaN(latestMatchs[index].rodada) ? " - " + latestMatchs[index].rodada + "ª rodada" : "") + "<br />" + matchDateTime + " - " + latestMatchs[index].nome_popular + "</p>\n \
                           </div>";
        }
    }

    $("#info-latest-matchs .overview").append(matchsList);

    $("#info-latest-matchs").tinycarousel(
    {
        start: 0,
        startPosition: startPosition,
        duration: 500,
        fixedPageWidth: 450,
        fixedViewWidth: 410,
        UseViewSize: true
    });
}

function getMatchDateTime(matchDate, matchTime)
{
    try
    {
        var matchDateTime = new Date(matchDate + " " + matchTime);

        return matchDateTime;
    }
    catch(error)
    {
        return "";
    }
}

function formatMatchDateTime(matchDateTime)
{
    try
    {
        var weekDay = new Array("Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab");
        var day = matchDateTime.getUTCDay();

        matchDate = weekDay[day] + ". " + formatNumber(matchDateTime.getDate()) + "/" + formatNumber((matchDateTime.getMonth() + 1));

        if(!isNaN(day))
            matchTime = " às " + formatNumber(matchDateTime.getHours()) + "h" + formatNumber(matchDateTime.getMinutes());

        return matchDate + matchTime;
    }
    catch(error)
    {
        return "sem data cadastrada";
    }
}

function formatNumber(number)
{
    if(number < 10)
        return "0" + number;
    else
        return number;
}
