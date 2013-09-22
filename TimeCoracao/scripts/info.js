function mainInfo(teamData)
{
    // Insere o css do time selecionado.
    $("<link type=\"text/css\" rel=\"stylesheet\" href=\"/estilo/times/" + teamData.className + ".css\">").appendTo("head");

    // Configura o layout da página com os dados do time escolhido.
    setTeamBasicInformation(teamData);

    // Busca as últimas notícias de highlight sobre o time em formato json.
    getLatestNewsJSON(teamData.className, function(latestNews)
    {
        populateCarouselLatestNews(latestNews);
        startCarouselLatestNews();
    });

    // Recupera a tabela de classificação no formato json, trata e exibe as informações na popup.
    getLeaderBoard(function(leaderBoard)
    {
        var rank = getTeamRank(leaderBoard, teamData.className);

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
        showTeamRanking(rank, teamData.className);
    });

    // Busca as últimas partidas do time em formato json.
    getLatestMatchsJSON(teamData.className, function(latestMatchs)
    {
        populateCarouselLatestMatchs(latestMatchs);
        startCarouselLatestMatchs();
    });
}

function setTeamBasicInformation(teamData)
{
    // Define o título.
    $("p.page-title").html(teamData.phonetic);

    // Define os links de acesso externo do topo.
    $("#link-globo").attr("href", teamData.globoLink).html(teamData.name + " na globo");
    $("#link-oficial").attr("href", teamData.oficialLink);
}

function populateCarouselLatestNews(latestNews)
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
}

function startCarouselLatestNews()
{
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

function getLatestNewsJSON(name, callback)
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

function getLatestMatchsJSON(name, callback)
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

function populateCarouselLatestMatchs(latestMatchs)
{
    var matchsList = "";
    var max = latestMatchs.length;

    // VC TEM QUE ARMAZENAR O SERVIDOR, TIPO, GLOBOESPORTE.GLOBO.COM PQ AS IMAGENS VEM FALTANDO O SERVIDOR.
    for(var index = 0; index < max; index++)
    {
        if(latestMatchs[index].slug_campeonato === "campeonato-brasileiro")
        {
            matchsList += "<div class=\"overview-item\">\n \
                               <div id=\"info-home\"><img src=\"" + latestMatchs[index].escudo_mandante.pequeno + "\" alt=\"\" title=\"\" /></div>\n \
                               <p id=\"home-score\" class=\"text-score\">" + latestMatchs[index].placar_oficial_mandante + "</p>\n \
                               <div id=\"info-versus\"></div>\n \
                               <p id=\"visitants-score\" class=\"text-score\">" + latestMatchs[index].placar_oficial_visitante + "</p>\n \
                               <div id=\"info-visitants\"><img src=\"/" + latestMatchs[index].escudo_visitante.pequeno + "\" alt=\"\" title=\"\" /></div>\n \
                               <p class=\"text-bold\">" + latestMatchs[index].nome_campeonato + " - " + latestMatchs[index].rodada + "ª rodada<br />" + latestMatchs[index].datajogo + " - " + latestMatchs[index].horajogo + " - " + latestMatchs[index].nome_popular + "</p>\n \
                           </div>";
        }
    }

    $("#info-latest-matchs .overview").append(matchsList);
}

function startCarouselLatestMatchs()
{
    $("#info-latest-matchs").tinycarousel(
    {
        start: 0,
        duration: 500,
        fixedPageWidth: 450,
        fixedViewWidth: 410,
        UseViewSize: true
    });
}