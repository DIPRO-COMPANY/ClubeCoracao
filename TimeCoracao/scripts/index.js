// Executa um evento no carregamento da extens�o.
document.addEventListener("DOMContentLoaded", function()
{	
	$.ajaxSetup({ cache: false });
	 
    $.getJSON("../times.json", function(data)
    {
    	alert(data);
    });
});