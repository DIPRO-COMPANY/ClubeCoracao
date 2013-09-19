function mainInfo(teamData)
{
    setTeamLayout(teamData);

    // Busca as últimas notícias de destaque sobre o time em formato json.
    getLatestNewsJSON(teamData.className, function(latestNews)
    {
        populateCarouselInfo(latestNews);
        startCarouselInfo();
    });
}

// Configura o layout da página com os dados do time escolhido.
function setTeamLayout(teamData)
{
    // Insere o css do time selecionado.
    $("<link type=\"text/css\" rel=\"stylesheet\" href=\"/estilo/times/" + teamData.className + ".css\">").appendTo("head");

    // Define o título.
    $("p.info-title").html(teamData.phonetic);

    // Define os links de acesso externo do topo.
    $("#link-globo").attr("href", teamData.globoLink).html(teamData.name + " na globo");
    $("#link-oficial").attr("href", teamData.oficialLink);


    getTeamNextMatch();

    //backPage.setTeamStatusBadge(4);

    if(1 == 1)
    {
        $("#info-lider").attr("class", "display-block");
    }
}

function populateCarouselInfo(latestNews)
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
                                 <span class=\"destaque\">" + latestNews[index].title + "</span>\n \
                                 <img src=\"" + latestNews[index].image + "\" />\n \
                                 <span class=\"sub-text\">" + latestNews[index].subtitle + "</span>\n \
                             </a>\n \
                         </div>";

        newsPagerList += "<div class=\"pager-item\">\n \
                              <img class=\"pager-seta\" src=\"/imagens/seta.png\" />\n \
                              <a rel=\"" + index + "\" class=\"pager-link\" href=\"#\">\n \
                                  <div class=\"pager-mask\"></div>\n \
                                  <img class=\"pager-ativo\" src=\"/imagens/circle.png\" />\n \
                                  <img class=\"pager-foto\" src=\"" + latestNews[index].image + "\" />\n \
                              </a>\n \
                          </div>";
    }

    $("div.overview").append(newsViewList);
    $("div.pager").append(newsPagerList);
}

function startCarouselInfo()
{
    $("#info-ultimas_noticias").tinycarousel(
    {
        start: 0,
        duration: 300,
        pager: true,
        interval: true,
        intervaltime: 3000,
        fixedPageWidth: 353,
        fixedViewWidth: 330,
        UseViewSize: true,
        callback: function(element, index)
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

        $(htmlData).find(".conteudo-extra").each(function()
        {
            title = $(this).find("a:last .globo-carrossel-titulo-texto").html();
            subtitle = $(this).find("a:last .globo-carrossel-subtitulo-texto").html();
            link = $(this).find("a:last").attr("href");
            image = $(this).find("img").attr("src");

            latestNews.push(
            {
                title: (title === undefined ? "" : title).replace(/(<([^>]+)>)/ig," ").replace(/\s+/, ""),
                subtitle: (subtitle === undefined ? "" : subtitle).replace(/(<([^>]+)>)/ig," ").replace(/\s+/, ""),
                link: (link === undefined ? "" : link),
                image: (image === undefined ? "" : image)
            });
        });

        callback(latestNews);
    });
}

function getTeamNextMatch()
{
    var url = "http://globoesporte.globo.com/dynamo/futebol/time/cruzeiro/listadejogos.json";
}