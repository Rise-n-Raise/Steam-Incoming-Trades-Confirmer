$('document').ready( function()
{
	if(/opskins\.com/.test(document.domain))
		chrome.runtime.sendMessage('activateOpskinsRef');
});