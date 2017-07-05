function opskinsAds()
{
	/* var lastAdsClick = localStorage.getItem('lastAdsClick');
	lastAdsClick = parseInt(lastAdsClick);
	if(!isNaN(lastAdsClick))
	{
		if(true) //if(lastAdsClick > new Date().getTime() - 12*60*60*1000)
		{
			$('.ads-elements').css('display', 'none');
			$('body').attr('style', '');
			$('.main-elements').css('display', '');
		}
	} */
	$('.ads-elements').css('display', 'none');
	$('body').attr('style', '');
	$('.main-elements').css('display', '');
}

$(document).ready( function()
{
	opskinsAds();
	
	var rate = localStorage.getItem('rate');
	if(rate == undefined || rate == '')
	{
		rate = 1000;
		$('#rate').val(rate);
		localStorage.setItem('rate', rate);
	}
	else
	{
		if(isNaN(parseInt(rate)))
		{
			rate = 1000;
			$('#rate').val(rate);
			localStorage.setItem('rate', rate);
		}
		else
		{
			if(rate < 0)
			{
				rate = 0;
				$('#rate').val(rate);
				localStorage.setItem('rate', rate);
			}
			else if(rate > 60000)
			{
				rate = 60000;
				$('#rate').val(rate);
				localStorage.setItem('rate', rate);
			}
			else
			{
				$('#rate').val(rate);
				localStorage.setItem('rate', rate);
			}
		}
	}
	$('#rate').change( function()
	{
		rate = $('#rate').val();
		rate = parseInt(rate);
		if(isNaN(rate))
		{
			rate = 1000;
			$('#rate').val(rate);
			localStorage.setItem('rate', rate);
		}
		else
		{
			if(rate < 0)
			{
				rate = 0;
				$('#rate').val(rate);
				localStorage.setItem('rate', rate);
			}
			else if(rate > 60000)
			{
				rate = 60000;
				$('#rate').val(rate);
				localStorage.setItem('rate', rate);
			}
			else
			{
				$('#rate').val(rate);
				localStorage.setItem('rate', rate);
			}
		}
	});
	
	var apiKey = localStorage.getItem('apiKey');
	if(apiKey == undefined)
	{
		apiKey = '';
		localStorage.setItem('apiKey', '');
	}
	else
	{
		$('#apiKey').val(apiKey);
	}
	$('#apiKey').change( function()
	{
		apiKey = $('#apiKey').val().replace(/[^0-9a-zA-Z]/g, '');
		$('#apiKey').val(apiKey);
		localStorage.setItem('apiKey', apiKey);
	});
	
	chrome.runtime.onMessage.addListener( function(response, sender, senDresponse)
	{
		if(response == 'active:true')
		{
			$('#buttononoff').prop('checked', true);
		}
		if(response == 'active:false')
		{
			$('#buttononoff').prop('checked', false);
		}
	});
	chrome.runtime.sendMessage('getActive');
	
	if(localStorage.getItem('SteamId') != undefined)
		$('#steamId').val(localStorage.getItem('SteamId'));
	$('#steamId').change( function()
	{
		var steamId = $('#steamId').val().replace(/[^0-9]/g, '');
		localStorage.setItem('SteamId', steamId);
		$('#steamId').val(steamId);
	});
	$('#buttononoff').click( function()
	{
		var button = $('#buttononoff').prop('checked');
		if(button == true)
		{
			if(localStorage.getItem('apiKey') != undefined && localStorage.getItem('apiKey') != '')
			{
				chrome.runtime.sendMessage('activate:true');
				chrome.browserAction.setBadgeBackgroundColor({ color: '#B9FF00'});
				chrome.browserAction.setBadgeText({ text: "On"});
			}
			else
			{
				chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000'});
				chrome.browserAction.setBadgeText({ text: "Off"});
				chrome.runtime.sendMessage('active:false');
				chrome.runtime.sendMessage('audioMsg:Set API Key!');
			}
		}
		else
		{
			chrome.runtime.sendMessage('activate:false');
		}
	});
});