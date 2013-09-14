// Recebe o id do time escolhido e busca sua colocação no site especificado.
function getTeamData(time)
{
	switch(parseInt(time))
	{
		case 1:
			$("#team-content").load("http://globoesporte.globo.com/futebol/times/atletico-mg");
			chrome.browserAction.setIcon({path: "imagens/atletico_mg.png"});
			new Badge().rebaixado(18);
			break;
		case 2:
			$("#team-content").load("http://globoesporte.globo.com/futebol/times/atletico-pr");
			chrome.browserAction.setIcon({ path:"imagens/atletico_pr.png"});
			new Badge().neutro(5);
		    break;
		case 3:
			$("#team-content").load("http://globoesporte.globo.com/futebol/times/bahia");
			chrome.browserAction.setIcon({ path:"imagens/bahia.png"});
			new Badge().libertadores(3);
		    break;
		case 4:
			$("#team-content").load("http://globoesporte.globo.com/futebol/times/cruzeiro/ #ge-classificacao-generica");
			chrome.browserAction.setIcon({ path:"imagens/cruzeiro.png"});
			new Badge().lider();
		    break;
		default:
	}
}