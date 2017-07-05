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
	
	$('.overlay').click( function(e)
	{
		if(e.target !== this)
			return;
		$('.overlay').fadeOut(300);
	});
	
	$('#openJsonEditor').click( function()
	{
		var check_steamIdList = localStorage.getItem('steamIdList');
		if(check_steamIdList != undefined)
		{
			try
			{
				check_steamIdList = JSON.parse(check_steamIdList);
				if(steamIdList instanceof Object)
				{
					let newArray = [];
					for(let n in check_steamIdList)
					{
						if(typeof check_steamIdList[n] == 'boolean')
						{
							newArray.push(n);
						}
						else
							delete check_steamIdList[n];
					}
					localStorage.setItem('steamIdList', JSON.stringify(check_steamIdList));
					$('#jsonEditor').val(JSON.stringify(newArray, 1, '\t'));
					updateList();
				}
				else
				{
					localStorage.setItem('steamIdList', '{}');
					$('#jsonEditor').val('[]');
					updateList();
				}
			}
			catch(err)
			{
				localStorage.setItem('steamIdList', '{}');
				$('#jsonEditor').val('[]');
				updateList();
			}
		}
		else
		{
			localStorage.setItem('steamIdList', '{}');
			$('#jsonEditor').val('[]');
			updateList();
		}
		$('#jsonEditorOverlay').fadeIn(300);
	});
	
	$('#jsonEditor').keydown( function(e)
	{
		var CaretPos = this.selectionStart;
		if(e.keyCode == 9)
		{
			var textVal = $(this).val();
			$(this).val(textVal.substr(0, CaretPos) + '\t' + textVal.substr(CaretPos, textVal.length - 1));
			CaretPos++;
			this.selectionStart = CaretPos;
			this.selectionEnd = CaretPos;
			return false;
		}
	});
	
	$('#saveJson').click( function()
	{
		var set_steamIdList = $('#jsonEditor').val();
		try
		{
			set_steamIdList = JSON.parse(set_steamIdList);
			if(set_steamIdList instanceof Array)
			{
				let newArray = [];
				let newObject = {};
				for(let i = 0; i < set_steamIdList.length; i++)
				{
					if(typeof set_steamIdList[i] == 'string')
					{
						newObject[set_steamIdList[i]] = true;
						newArray.push(set_steamIdList[i]);
					}
				}
				$('#jsonEditor').val(JSON.stringify(newArray, 1, '\t'));
				localStorage.setItem('steamIdList', JSON.stringify(newObject));
				updateList();
				$('#jsonEditorOverlay').fadeOut(300);
			}
			else
			{
				chrome.runtime.sendMessage('msg:SteamIdList is not instanceof ' + (typeof steamIdList));
			}
		}
		catch(err)
		{
			chrome.runtime.sendMessage('msg:' + err.message);
			if(err.message.indexOf('in JSON') > (-1))
			{
				var position = parseInt(err.message.replace(/[^0-9]/g, ''));
				var emuThis = $('#jsonEditor')[0];
				emuThis.selectionStart = position;
				emuThis.selectionEnd = position;
				$('#jsonEditor').focus();
			}
		}
	});
}

function preLoader()
{
	var check_steamIdList = localStorage.getItem('steamIdList');
	if(check_steamIdList != undefined)
	{
		try
		{
			check_steamIdList = JSON.parse(check_steamIdList);
			if(steamIdList instanceof Object)
			{
				let newArray = [];
				for(let n in check_steamIdList)
				{
					if(typeof check_steamIdList[n] == 'boolean')
					{
						newArray.push(n);
					}
					else
						delete check_steamIdList[n];
				}
				localStorage.setItem('steamIdList', JSON.stringify(check_steamIdList));
				$('#jsonEditor').val(JSON.stringify(newArray, 1, '\t'));
				updateList();
			}
			else
			{
				localStorage.setItem('steamIdList', '{}');
				$('#jsonEditor').val('[]');
				updateList();
			}
		}
		catch(err)
		{
			localStorage.setItem('steamIdList', '{}');
			$('#jsonEditor').val('[]');
			updateList();
		}
	}
	else
	{
		localStorage.setItem('steamIdList', '{}');
		$('#jsonEditor').val('[]');
		updateList();
	}
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