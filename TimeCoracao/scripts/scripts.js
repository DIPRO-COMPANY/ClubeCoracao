function Badge(){
	this.position = function(position){
		chrome.browserAction.setBadgeBackgroundColor({color: "#0000FF"});
		chrome.browserAction.setBadgeText ( { text: position + "" } );
	};	
}


// Recebe o id do time escolhido e busca sua colocação no site especificado.
function getTeamData(time)
{
	switch(parseInt(time))
	{
		case 1:
			var jqxhr = $.ajax("http://www.gazetaesportiva.net/upload/campeonatos/brasileiro_serie-a_html/brasileiro_classificacao_2013.html")
		    .done(function(data)
		    {
				chrome.browserAction.setIcon({ path: "imagens/cruzeiro.png" });
				new Badge().position(1);	
		    });
			chrome.browserAction.setIcon({ path: "imagens/cruzeiro.png" });
			new Badge().position(1);
			break;
		case 2:
			var jqxhr = $.ajax("http://m.globoesporte.globo.com/futebol/brasileirao-serie-a")
		    .done(function(data)
		    {
		    	$("#team-content").load("http://m.globoesporte.globo.com/futebol/brasileirao-serie-a")
				chrome.browserAction.setIcon({ path: "imagens/atletico_mg.png" });
				new Badge().position(18);
		    });
			break;
		default:
	}
}

// Executa um evento no carregamento da página.
document.addEventListener("DOMContentLoaded", function()
{
	getTeamData($("#team-select").val());
});

$(document).ready(function()
{
	$("#team-select").on("change", function()
	{
		getTeamData($("#team-select").val());
	});
});