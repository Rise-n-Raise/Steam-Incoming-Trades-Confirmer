$(document).ready( function()
{
	function checkSubscr()
	{
		$('#subscrBtn').unbind('click', checkSubscr);
		$('#subscrBtn').css('display', 'none');
		$('#loading').css('display', 'block');
		var subcheck = new XMLHttpRequest();
		subcheck.open("GET", "http://extensions.risenraise.com/profile/", true);
		subcheck.send(null);
		subcheck.onreadystatechange = function()
		{
			if(subcheck.readyState == 4)
			{
				if(subcheck.responseText)
				{
					var data = subcheck.responseText;
					var email = $('#email', data).text();
					if(email != '')
					{
						var subDays = $('span[name="Steam Incoming Trades Confirmer"]', data).text();
						if($('span[name="CSGOPolygon.com helper"]', data).text() != '' && !isNaN(parseInt($('span[name="CSGOPolygon.com helper"]', data).text())) && parseInt($('span[name="CSGOPolygon.com helper"]', data).text()) >= 0)
							subDays = parseInt($('span[name="CSGOPolygon.com helper"]', data).text());
						if((subDays != undefined) && (subDays != '') && (parseInt(subDays) >= 0))
						{
							if(subDays == '0') subDays = 1;
							var subscription = 'true';
						}
						else
						{
							var subscription = 'false';
							subDays = '0';
						}
						localStorage.setItem('accountMail', email);
						localStorage.setItem('days', subDays);
						localStorage.setItem('sub', subscription);
						chrome.storage.sync.set({'sitcSub': subscription});
						chrome.runtime.sendMessage('startsubcheck');
						$('#loading').css('display', 'none');
						$('#subscription').css('display', 'block');
						$('#mail').text(localStorage.getItem('accountMail'));
						$('#days').text(localStorage.getItem('days'));
					}
					else
					{
						var subscription = 'false';
						var subDays = '0';
						localStorage.setItem('accountMail', email);
						localStorage.setItem('sub', subscription);
						localStorage.setItem('days', subDays);
						chrome.storage.sync.set({'sitcSub': subscription});
						$('#loading').css('display', 'none');
						$('#login').css('display', 'block');
					}
				}
				else
				{
					$('#subscrBtn').bind('click', checkSubscr);
					$('#loading').css('display', 'none');
					$('#subscrBtn').css('display', 'block');
				}
			}
		}
	}
	if(localStorage.getItem('sub') == 'true')
	{
		$('#subscrBtn').css('display', 'none');
		$('#subscription').css('display', 'block');
		$('#mail').text(localStorage.getItem('accountMail'));
		$('#days').text(localStorage.getItem('days'));
	}
	else
	{
		$('#subscrBtn').bind('click', checkSubscr);
	}
	
	var rate = localStorage.getItem('rate');
	if(rate == undefined || rate == '')
	{
		rate = 20;
		$('#rate').val(rate);
		localStorage.setItem('rate', rate);
	}
	else
	{
		if(isNaN(parseInt(rate)))
		{
			rate = 20;
			$('#rate').val(rate);
			localStorage.setItem('rate', rate);
		}
		else
		{
			if(rate < 1)
			{
				rate = 1;
				$('#rate').val(rate);
				localStorage.setItem('rate', rate);
			}
			else if(rate > 180)
			{
				rate = 180;
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
			rate = 20;
			$('#rate').val(rate);
			localStorage.setItem('rate', rate);
		}
		else
		{
			if(rate < 1)
			{
				rate = 1;
				$('#rate').val(rate);
				localStorage.setItem('rate', rate);
			}
			else if(rate > 180)
			{
				rate = 180;
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
				if(localStorage.getItem('sub') == 'true')
				{
					chrome.runtime.sendMessage('activate:true');
					chrome.browserAction.setBadgeBackgroundColor({ color: '#B9FF00'});
					chrome.browserAction.setBadgeText({ text: "On"});
				}
				else if(localStorage.getItem('sub') == 'false')
				{
					chrome.runtime.sendMessage('audioMsg:No subscription!');
					$('#buttononoff').prop('checked', false);
				}
				else
				{
					chrome.runtime.sendMessage('audioMsg:Check subscription!');
					$('#buttononoff').prop('checked', false);
				}
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