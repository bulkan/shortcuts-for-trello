chrome.extension.sendMessage({}, function(response) {

  // Create a flash message
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
    .fadeIn(function(){
      $("#floatingDiv").fadeOut(function(){
        $("#floatingDiv").remove();
      })
    });
  };

  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      document.onkeypress = function(e) {
        var card = $('.active-card');

        // press y on active card to 'yank' its url to the clipboard
        if(e.which === 121) {

          if(card.length !== 1){
            return;
          }

          var url = $('.list-card-details > a', card)[0].href;
          url = url.substr(0, url.lastIndexOf('/'));
          flashMessage(card, 'Copied');

          chrome.extension.sendMessage({ text: url });
        }
        // ctrl+m
        else if (e.ctrlKey && e.which === 13){
          if(card.length !== 1){
            return;
          }

          console.log('ctrl+m');
          card.find('span.list-card-operation').trigger('click');
          var elm = document.querySelector('a.js-move-card');

          // not a jquery event ? or some sort of weird event bubble bug
          elm.click();
        }
        // ctrl+n for notifications popup
        //else if (e.which === 110){
          //document.querySelector('.header-notifications.js-open-header-notifications-menu').click();
        //}
      };

    }
  }, 10);
});
