var start = 0;
var bookmarkCartolaAux;

function mainCartola()
{
    // Gets the page basic data
    // Obtem os dados básicos da página.
    setCartolaBasicLayout();

    // Sets the events for elements of the page
    // Define os eventos para os elementos da página.
    setCartolaEvents();

    getBookmarkCartola();

    loadSearchData();
}

function setCartolaBasicLayout()
{
    // Gets the title with the market data.
    // Obtem o título com os dados do mercado
    getCartolaTitle(function(data)
    {
        if(data !== undefined)
        {
            $(data).appendTo("#cartola-logo");
        }
    });
}

function getCartolaTitle(callback)
{
    getHTML("http://sportv.globo.com/site/cartola-fc/",
    function(htmlData)
    {
        callback($(htmlData).find(".status-fechamento"));
    });
}

function setCartolaEvents()
{
    var buttons = $("#buttons-bar").find(".button");

    buttons.on("click", function()
    {
        if($(this).hasClass("enabled"))
        {
            $("div.disabled").toggleClass("enabled").toggleClass("disabled");

            $(this).toggleClass("disabled").toggleClass("enabled");

            if($(this).hasClass("search-cartola"))
                loadSearchData();
            else if($(this).hasClass("list-cartola"))
                loadListData();
            else if($(this).hasClass("ranking-cartola"))
                loadRankingData();
        }
     });
}

function loadSearchData()
{
    var searchData = "<div id=\"search-results\">\n \
                          <div class=\"title\">\n \
                              <span>\n \
                                  <input type=\"text\" id=\"search-text\" placeholder=\"informe um time ou cartoleiro e digite enter\" />\n \
                                  <span class=\"input-prepend\"><i class=\"icon-search\"></i></span>\n \
                                  <span class=\"search-icon hidden\"><i class=\"icon-spinner icon-spin\"></i></span>\n \
                              </span>\n \
                          </div>\n \
                          <div id=\"no-results\" class=\"display-none\"><span>Nenhuma equipe encontrada!</span></div>\n \
                          <div id=\"results-content\">\n \
                              <ul id=\"results-row\" class=\"display-none\"></ul>\n \
                          </div>\n \
                          <div id=\"show-more\" class=\"display-none\"></div>\n \
                      </div>";

    $("#cartola-content").html(searchData);

    $("#search-text").keypress(function(event)
    {
        if(event.which === 13)
        {
            if(this.value !== "")
                $(".search-icon").toggleClass("hidden");

            $("#results-row").html("");

            if(!$("#no-results").hasClass("display-none"))
                $("#no-results").toggleClass("display-none");

            if(!$("#results-row").hasClass("display-none"))
                $("#results-row").toggleClass("display-none");

            if(!$("#show-more").hasClass("display-none"))
                $("#show-more").toggleClass("display-none");

            getCartolaTeamsList(escape(this.value));
            event.preventDefault();
        }
    });
}

function loadListData()
{
    var listData = "<div id=\"list-results\">\n \
                        <div class=\"title\">\n \
                        <span>equipes armazenadas</span>\n \
                    </div>";

    $("#cartola-content").html(listData);
}

function loadRankingData()
{
    var rankingData = "<div id=\"ranking-results\">\n \
                           <div class=\"title\">\n \
                           <span>ranking atualizado - rodada 26</span>\n \
                       </div>";

    $("#cartola-content").html(rankingData);
}

function getCartolaTeamsList(text)
{
    var teamsList = "";
    var indexTeam = -1;

    getHTML("https://api.cartola.globo.com/time/busca.jsonp?nome=" + text + "&start=" + start + "&rows=10", function(responseText)
    {
        // Remove o conteúdo json da função.
        data = JSON.parse(responseText.match(/\((.*)\)\;/)[1]);

        if($(data.times).length === 0)
            $("#no-results").toggleClass("display-none");
        else
        {
            $("#results-row").toggleClass("display-none");

            $(data.times).each(function(index)
            {
                indexTeam = -1;

                if(Array.isArray(bookmarkCartolaAux))
                {
                    for(var indexAux = 0; indexAux < bookmarkCartolaAux.length; indexAux++)
                    {
                        if(data.times[index].slug === bookmarkCartolaAux[indexAux].slug)
                        {
                            indexTeam = indexAux;
                            break;
                        }
                    }
                }

                teamsList += "<li id=\"" + data.times[index].slug + "\">\n \
                                  <span class=\"cartola-badge\"><img src=\"" + data.times[index].imagens_escudo.img_escudo_32x32 + "\" alt=\"\" /></span>\n \
                                  <span class=\"cartola-team\"><span>" + data.times[index].nome + "</span></span>\n \
                                  <span class=\"cartola-owner\">\n \
                                      <span class=\"owner-name\">" + data.times[index].nome_cartola + "</span>\n \
                                      <i class=\"" + (indexTeam < 0 ? "icon-check-empty" : "icon-check") + "\" title=\"" + (indexTeam < 0 ? "Adicionar ao " : "Remover do ") + "bookmark\"></i>\n \
                                  </span>\n \
                              </li>";
            });

            $("#results-row").html(teamsList);

            $("#results-row i").on("click", function(){bookmarkTeam($(this));});


            if(data.total > start + 5)
                $("#show-more").removeClass("display-none");
        }

        $(".search-icon").toggleClass("hidden");
    });
}

function bookmarkTeam(icon)
{
    var teamParent = icon.parent().parent();

    var teamData = {
        slug: teamParent.attr("id"),
        escudo: teamParent.find(".cartola-badge img").attr("src"),
        nome: teamParent.find(".cartola-team span").html(),
        owner: teamParent.find(".owner-name").html(),
    };

    setBookmarkCartola(teamData, icon.hasClass("icon-check-empty"));

    if(icon.hasClass("icon-check-empty"))
        icon.attr("class", "icon-check");
    else
        icon.attr("class", "icon-check-empty");
}

function setBookmarkCartola(teamData, salvar)
{
    chrome.extension.sendMessage(
    {
        action: "saveBookmarkCartola",
        teamData: teamData,
        salvar: salvar
    }, function(bookmarkCartola){ bookmarkCartolaAux = bookmarkCartola; });
}

function getBookmarkCartola()
{
    chrome.extension.sendMessage(
    {
        action: "getLSData",
        id: "bookmarkCartola",
        json: true
    }, function(bookmarkCartola){ bookmarkCartolaAux = bookmarkCartola; });
}
/*

        <ul id="list-row">
            <li>
                <span class="cartola-badge"><img src="http://s.glbimg.com/es/ca/escudos/times/6d/d7/escudo_32x32_time_6632429.png" alt="" /></span>
                <span class="cartola-team"><span>Blue Fox FC</span></span>
                <span class="cartola-owner">
                    <span>Raphael Quintão</span>
                    <span class="add-list checked" title="Remover da listar"></span>
                </span>
                <div class="hover-mask"></div>
            </li>
        </ul>



        <ul id="list-row">
            <li>
                <span class="cartola-badge"><img src="http://s.glbimg.com/es/ca/escudos/times/6d/d7/escudo_32x32_time_6632429.png" alt="" /></span>
                <span class="cartola-team"><span>Blue Fox FC</span></span>
                <span class="cartola-owner">
                    <span>Raphael Quintão</span>
                    <span class="add-list checked" title="Remover da listar"></span>
                </span>
                <div class="hover-mask"></div>
            </li>
        </ul>
    
    
    
*/