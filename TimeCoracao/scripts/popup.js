var teamId, name, icon, globoLink, oficialLink, className, phonetic;

document.addEventListener("DOMContentLoaded", function()
{
	recoverTeamDataBackground();

	$.ajaxSetup({ cache: false });

	loadPage(teamId);
});

function loadPage(id)
{
	if(id == 0)
	{
		// Carrega a página inicial e executa a função main dentro do .js referente ao arquivo.
		$("#content").load("home.html", function(){mainHome();});
	}
	else
	{
		// Carrega a página de informação do time e executa a função main dentro do .js referente ao arquivo.
		$("#content").load("info.html", function(){mainInfo();});
	}
}

// Recupera os dados do time da página de backgrund.
function recoverTeamDataBackground()
{
	var backPage = chrome.extension.getBackgroundPage();
	
	teamId = backPage.teamId;
	name = backPage.name;
	icon = backPage.icon;
	globoLink = backPage.globoLink;
	oficialLink = backPage.oficialLink;
	className = backPage.className;
	phonetic = backPage.phonetic;
}