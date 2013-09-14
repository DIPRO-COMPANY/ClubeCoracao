// Executa um evento no carregamento da extensão.
document.addEventListener("DOMContentLoaded", function()
{	
	$.ajaxSetup({ cache: false });
	 
    $.getJSON("../times.json", function(data)
    {
    	alert(data);
    });
});