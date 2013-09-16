function mainInfo()
{
	$("<link type=\"text/css\" rel=\"stylesheet\" href=\"estilo/" + className + ".css\">").appendTo("#content");
	$("p.info-title").html(phonetic);
	$("#link-globo").attr("href", globoLink)
	.html(phonetic + " na globo");
	$("#link-oficial").attr("href", oficialLink);

	$("#info-ultimas_noticias").tinycarousel(
    {
        start: 0,
        duration: 500,
        pager: true,
        //interval: true,
        //intervaltime: 3000,
        fixedPageWidth: 353,
        fixedViewWidth: 330,
        UseViewSize: true,
        callback: function(element, index)
        {
            //getTeamData(data, index);
        }
    });
}