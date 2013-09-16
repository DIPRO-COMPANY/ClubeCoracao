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
		// Carrega a p�gina inicial e executa a fun��o main dentro do .js referente ao arquivo.
		$("#content").load("home.html", function(){mainHome();});
	}
	else
	{
		// Carrega a p�gina de informa��o do time e executa a fun��o main dentro do .js referente ao arquivo.
		$("#content").load("info.html", function(){mainInfo();});
	}
}

// Recupera os dados do time da p�gina de backgrund.
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