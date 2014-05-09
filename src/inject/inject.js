chrome.extension.sendMessage({}, function(response) {

  var flashMessage = function(card, message){
    var position = card.offset();
    $('body').append('<div id="floatingDiv">' + message + '</div>');
    $("#floatingDiv").css({
      "position": "absolute",
      "top": position.top + 5,
      "left": position.left + (card.width() / 3),
      "color": "white",
      "background-color": "rgba(40, 50, 75, 0.65)",
      "padding": "5px"
    })
      .fadeIn( function(){
        $("#floatingDiv").fadeOut(function(){
          $("#floatingDiv").remove();
        })
      });
  };

  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      document.onkeypress = function(e) {

        // press y on active card to 'yank' its url to the clipboard
        if(e.which === 121) {

          var card = $('.active-card');
          if(card.length === 1){
            var url = $('.list-card-details > a', card)[0].href;
            url = url.substr(0, url.lastIndexOf('/'));
            flashMessage(card, 'Copied');

            chrome.extension.sendMessage({ text: url });
          }
        }
      };
    }
  }, 10);
});
