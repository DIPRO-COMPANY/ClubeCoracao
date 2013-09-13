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
			
			$("team-content").load("http://globoesporte.globo.com/futebol/times/atletico-mg");
			chrome.browserAction.setIcon({ path: "imagens/cruzeiro.png" });
			new Badge().position(1);	
			break;
		case 2:
			$("team-content").load("http://globoesporte.globo.com/futebol/times/atletico-pr");
			chrome.browserAction.setIcon({ path: "imagens/atletico_pr.png" });
			new Badge().position(18);
		    break;
		case 3:
			$("team-content").load("http://globoesporte.globo.com/futebol/times/bahia");
			chrome.browserAction.setIcon({ path: "imagens/bahia.png" });
			new Badge().position(18);
		    break;
		default:
	}
}

// Executa um evento no carregamento da página.
document.addEventListener("DOMContentLoaded", function()
{
	//getTeamData($("#team-select").val());
});

$(document).ready(function()
{
	$("#team-select").on("change", function()
	{
		getTeamData($("#team-select").val());
	});
});