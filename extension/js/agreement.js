var agreement = localStorage.getItem('agreement');
if(!agreement)
{
	localStorage.setItem('agreement', '1');
	chrome.tabs.create({ url : 'http://extensions.risenraise.com/pages/extensions-agreement/'});
}