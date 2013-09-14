var phonetic = "";
var id = 0;

$(document).ready(function()
{
	$("#hint").mouseenter(function()
    {
    	if($(this).attr("class") == "click")
    	{
    		phonetic = $(this).html();
    		$(this).html("escolher");
    	}
    })
    .mouseout(function()
    {
    	if($(this).attr("class") == "click")
    		$(this).html(phonetic);
    })
    .click(function()
    {
    	if(id > 0)
    		openTeamInfo(id);
    });
});

// Executa um evento no carregamento da extensão.
document.addEventListener("DOMContentLoaded", function()
{	
	$.ajaxSetup({ cache: false });
	 
	getTeams();	
});

// Busca os dados dos times da primeira divisão do brasileirão.
function getTeams()
{
	$.getJSON("../times.json", function(data)
    {
		populateCarousel(data);
    })
    .error(function()
    {
    	$("#hint").html("erro ao carregar os dados");
    });
}

// Popula o carrossel para seleção dos times de acordo com os dados retornados pelo json.
function populateCarousel(data)
{	
	var max = data.length;
	var option = "";
	
    for(var idx = 0; idx < max; idx++)
	{       	
		option += "<li id=\"" + data[idx].id + "\"><img src=\"/imagens/" + data[idx].icon + "\" alt=\"" + data[idx].colorBac + "|" + data[idx].colorFor + "\" title=\"" + data[idx].phonetic + "\" /></li>";
	}
    
    $(".overview").append(option);

    // Caso tenha conseguido carregar a lista de times, exibe a opção de escolha do mesmo.
    if(max > 0 && option != "")
	{
    	$("#slider-code").tinycarousel(
		{
			start:0,
			duration:1000,
			callback: function(element, index)
			{
				getTeamData(element, index);
			}
        });
    	
    	$("#slider-code").attr("class", "display-block");
	}
    else
    {
    	// Tratar depois com ícone de erro ao carregar combo.
    }
}

// Recupera os dados do time como nome e cores para exibição no hint.
function getTeamData(element, index)
{
	id = element.id;

	var icone = $(element).find("img");
	var colors = icone.attr("alt").split("|");
	var hint = $("#hint");

	phonetic = icone.attr("title");
	
    if(hint.html() != "escolher")
    {
    	hint.html(phonetic);
    }
    
	hint.css("background-color", colors[0].toString())
	.css("color", colors[1].toString())
	.attr("class", "click");
}

// Abre a popup com os dados do time selecionado.
function openTeamInfo(id)
{
	switch(parseInt(id))
	{
		case 1:
			chrome.browserAction.setIcon({path: "imagens/atletico_mg.png"});
			break;
		case 2:
			chrome.browserAction.setIcon({path: "imagens/atletico_pr.png"});
			break;
		case 3:
			chrome.browserAction.setIcon({path: "imagens/bahia.png"});
			break;
		case 4:
			chrome.browserAction.setIcon({path: "imagens/botafogo.png"});
			break;
		case 5:
			chrome.browserAction.setIcon({path: "imagens/corinthians.png"});
			break;
		case 6:
			chrome.browserAction.setIcon({path: "imagens/coritiba.png"});
			break;
		case 7:
			chrome.browserAction.setIcon({path: "imagens/criciuma.png"});
			break;
		case 8:
			chrome.browserAction.setIcon({path: "imagens/cruzeiro.png"});
			break;
		case 9:
			chrome.browserAction.setIcon({path: "imagens/flamengo.png"});
			break;
		case 10:
			chrome.browserAction.setIcon({path: "imagens/fluminense.png"});
			break;
		case 11:
			chrome.browserAction.setIcon({path: "imagens/goias.png"});
			break;
		case 12:
			chrome.browserAction.setIcon({path: "imagens/gremio.png"});
			break;
		case 13:
			chrome.browserAction.setIcon({path: "imagens/internacional.png"});
			break;
		case 14:
			chrome.browserAction.setIcon({path: "imagens/nautico.png"});
			break;
		case 15:
			chrome.browserAction.setIcon({path: "imagens/ponte_preta.png"});
			break;
		case 16:
			chrome.browserAction.setIcon({path: "imagens/portuguesa.png"});
			break;
		case 17:
			chrome.browserAction.setIcon({path: "imagens/sao_paulo.png"});
			break;
		case 18:
			chrome.browserAction.setIcon({path: "imagens/vasco.png"});
			break;
		case 19:
			chrome.browserAction.setIcon({path: "imagens/vitoria.png"});
			break;
		default:
	}
	
	chrome.browserAction.setPopup({popup: "info.html"});
}