window.headers =
{
	forUrl : null,
	Referer : null,
	Origin : null,
	'User-Agent' : null
}

window.changeHeadersForTheNextRequest = function(obj)
{
	headers =
	{
		forUrl : obj.forUrl,
		Referer : obj.Referer,
		Origin : obj.Origin,
		'User-Agent' : obj['User-Agent']
	}
}

window.onBeforeSendHeadersFunction = function(details)
{
	var url = headers.forUrl;
	if(typeof url == 'string')
	{
		if(url == details.url)
		{
			var newReferer = headers.Referer;
			if(typeof newReferer == 'string')
			{
				var gotReferer = false;
				var n;
				for(n in details.requestHeaders)
				{
					gotReferer = details.requestHeaders[n].name.toLowerCase() == "referer";
					if(gotReferer)
					{
						details.requestHeaders[n].value = newReferer;
						break;
					}
				}
				if(!gotReferer)
				{
					details.requestHeaders.push({ name : 'Referer', value : newReferer });
				}
			}
			
			var newOrigin = headers.Origin;
			if(typeof newOrigin == 'string')
			{
				var gotOrigin = false;
				n = undefined;
				for(n in details.requestHeaders)
				{
					gotOrigin = details.requestHeaders[n].name.toLowerCase() == "origin";
					if(gotOrigin)
					{
						details.requestHeaders[n].value = newOrigin;
						break;
					}
				}
				if(!gotOrigin)
				{
					details.requestHeaders.push({ name : 'Origin', value : newOrigin });
				}
			}
			
			var newUserAgent = headers['User-Agent'];
			if(typeof newUserAgent == 'string')
			{
				var gotUserAgent = false;
				n = undefined;
				for(n in details.requestHeaders)
				{
					gotUserAgent = details.requestHeaders[n].name.toLowerCase() == "user-agent";
					if(gotUserAgent)
					{
						details.requestHeaders[n].value = newUserAgent;
						break;
					}
				}
				if(!gotUserAgent)
				{
					details.requestHeaders.push({ name : 'User-Agent', value : newUserAgent });
				}
			}
			
			headers =
			{
				forUrl : null,
				Referer : null,
				Origin : null,
				'User-Agent' : null
			}
			
			return { requestHeaders : details.requestHeaders };
		}
	}
}

chrome.webRequest.onBeforeSendHeaders.addListener( onBeforeSendHeadersFunction,
{
    urls : ["<all_urls>"]
},
[
    "requestHeaders",
    "blocking"
]);