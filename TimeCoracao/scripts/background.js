var teamId, name, icon, globoLink, oficialLink, className, phonetic;

function main()
{
	//new LocalStorage().set("teamId", 0);

	recoverTeamData();

	setTeamIcon(teamId);

	// Escuta as mensagens das popups.
	chrome.extension.onMessage.addListener(function(request, sender, sendResponse)
	{
		// Salva o id do time selecionado e abre a sua página de informações.
		if(request.type == "popup" && request.action == "saveTeamData")
		{
			saveTeamData(request);
	
			var popups = chrome.extension.getViews({type: "popup"});
			
			// Carrega a página de informações do time selecionado.
			if(popups.length)
				popups[0].loadPage(teamId);

			setTeamIcon(teamId);
		}

		return true;
	});
}

//Define o ícone do browseraction como o escudo do time escolhido.
function setTeamIcon(id)
{
	chrome.browserAction.setIcon({path: "/imagens/" + icon});
}

// Armazena os dados do time selecionado na local storage.
function saveTeamData(data)
{
	teamId = parseInt(data.teamId);
	name = data.name;
	icon = data.icon;
	globoLink = data.globoLink;
	oficialLink = data.oficialLink;
	className = data.className;
	phonetic = data.phonetic;

	new LocalStorage().set("teamId", teamId);
	new LocalStorage().set("name", name);
	new LocalStorage().set("icon", icon);
	new LocalStorage().set("globoLink", globoLink);
	new LocalStorage().set("oficialLink", oficialLink);
	new LocalStorage().set("className", className);
	new LocalStorage().set("phonetic", phonetic);
}

// Recupera os dados do time armazenado na local storage.
function recoverTeamData()
{
	teamId = new LocalStorage().getInt("teamId");
	name = new LocalStorage().get("name");
	icon = new LocalStorage().get("icon");
	globoLink = new LocalStorage().get("globoLink");
	oficialLink = new LocalStorage().get("oficialLink");
	className = new LocalStorage().get("className");
	phonetic = new LocalStorage().get("phonetic");
}

main();