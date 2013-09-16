function mainInfo()
{
	$("<link type=\"text/css\" rel=\"stylesheet\" href=\"estilo/" + className + ".css\">").appendTo("#content");
	$("p.info-title").html(phonetic);
	$("#link-globo").attr("href", globoLink)
	.html(phonetic + " na globo");
	$("#link-oficial").attr("href", oficialLink);
}