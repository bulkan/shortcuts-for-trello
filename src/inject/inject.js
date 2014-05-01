chrome.extension.sendMessage({}, function(response) {

	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {

			clearInterval(readyStateCheckInterval);

	    document.onkeypress = function(e) {

	      // press y on active card to 'yank' its url to the clipboard
	      if(e.which === 121) {

	        if(document.querySelector('.active-card')){
	          var url = document.querySelector('.active-card .list-card-details > a').href;
	          url = url.substr(0, url.lastIndexOf('/'));

	          chrome.extension.sendMessage({ text: url });
	        }
	      }
	    };
		}
	}, 10);
});
