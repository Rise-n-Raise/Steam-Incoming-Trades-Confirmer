$(document).ready( function()
{
	caller();
});

function caller()
{
	closeOther();
	preLoader();
	listeners();
}

function updateList()
{
	var check_steamIdList = localStorage.getItem('steamIdList');
	if(check_steamIdList != undefined)
	{
		try
		{
			var strHtml = '';
			
			check_steamIdList = JSON.parse(check_steamIdList);
			
			for(let n in check_steamIdList)
			{
				if(typeof check_steamIdList[n] != 'boolean')
					delete check_steamIdList[n];
			}
			
			for(let n in check_steamIdList)
			{
				strHtml += '<li>' + n + '</li>';
			}
			
			$('#steamIdList').html(strHtml);
		}
		catch(err)
		{
			localStorage.setItem('steamIdList', '{}');
		}
	}
	else
	{
		localStorage.setItem('steamIdList', '{}');
	}
}

function listeners()
{
	$('#addSteamId').click( function()
	{
		var steamIdToAdd = $('#steamIdToAdd').val().replace(/[^0-9]/g, '');
		$('#steamIdToAdd').val('');
		var list = JSON.parse(localStorage.getItem('steamIdList'));
		list[steamIdToAdd] = true;
		localStorage.setItem('steamIdList', JSON.stringify(list));
		updateList();
	});
	
	$('#deleteSteamId').click( function()
	{
		var steamIdToDelete = $('#steamIdToDelete').val();
		var list = JSON.parse(localStorage.getItem('steamIdList'));
		delete list[steamIdToDelete];
		localStorage.setItem('steamIdList', JSON.stringify(list));
		updateList();
	});
}

function preLoader()
{
	updateList();
}

function closeOther()
{
	var closeNotMeRand = '' + parseInt(Math.random()*9999999999999999 + 1);
	chrome.runtime.onMessage.addListener( function(response, sender, senDresponse)
	{
		if(/^closeOtherTab\:/gim.test(response))
		{
			var replacedResp = response.replace(/closeOtherTab\:/gim, '');
			if(replacedResp != closeNotMeRand)
			{
				window.close();
			}
		}
	});
	chrome.runtime.sendMessage('closeOtherTab:'+closeNotMeRand);
}