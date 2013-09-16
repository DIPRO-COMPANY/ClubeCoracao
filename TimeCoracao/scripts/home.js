function mainHome()
{
	// Defini os eventos do hint.
	$("#home-hint").mouseenter(function()
	{
		if($(this).attr("class").indexOf("click") > -1)
		{
			phonetic = $(this).html();
			$(this).html("escolher");
		}
	})
	.mouseout(function()
	{
		if($(this).attr("class").indexOf("click") > -1)
			$(this).html(phonetic);
	})
	.click(function()
	{
		if(teamId > 0)
		{
			// Envia para o background o time escolhido.
			chrome.extension.sendMessage(
			{
				type: "popup",
				action: "saveTeamData",
				teamId: teamId,
				name: name,
				icon: icon,
				globoLink: globoLink,
				oficialLink: oficialLink,
				className: className,
				phonetic: phonetic
			}, function(){});
		}
	});

	getTeams();
}

// Busca os dados dos times da primeira divis�o do brasileir�o.
function getTeams()
{
	$.getJSON("../times.json", function(data)
	{
		populateCarousel(data);
		startCarousel(data);
	})
	.error(function()
	{
		$("#home-hint").html("erro ao carregar os dados");
	});
}

// Popula o carrossel para sele��o dos times de acordo com os dados retornados pelo json.
function populateCarousel(data)
{
	var max = data.length;
	var option = "";

	for(var idx = 0; idx < max; idx++)
	{
		option += "<li id=\"" + data[idx].id + "\"><img src=\"/imagens/" + data[idx].icon + "\" /></li>";
	}

	$(".overview").append(option);
}

function startCarousel(data)
{
	$("#home-slider-code").tinycarousel(
	{
		start:0,
		duration:1000,
		callback: function(element, index)
		{
			getTeamData(data, index);
		}
	}).attr("class", "visibility-visible");
}

//Recupera os dados do time como nome e cores para exibi��o no hint.
function getTeamData(data, index)
{
	var hint = $("#home-hint");

	teamId = data[index].id;
	name = data[index].name;
	icon = data[index].icon;
	globoLink = data[index].globoLink;
	oficialLink = data[index].oficialLink;
	className = data[index].className;
	phonetic = data[index].phonetic;

	if(hint.html() != "escolher")
	{
		hint.html(phonetic);
	}

	hint.attr("class", "click " + className);
}