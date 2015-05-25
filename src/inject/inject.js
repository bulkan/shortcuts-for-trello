/* global chrome */

chrome.extension.sendMessage({}, function() {

  var elm, card, readyStateCheckInterval;

  readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      chrome.runtime.onMessage.addListener(routeCommand);
    }
  }, 10);

  function routeCommand(request) {
    card = $('.active-card');
    switch(request.command) {
        case 'movecard':
          moveCard();
        break;
        case 'copycard':
          copyCard();
        break;
        case 'yank':
          yank();
        break;
        case 'movecardup':
          moveCardUp();
        break;
        case 'notifications':
          notifications();
        break;
        case 'scrolltop':
          scrollTop();
        break;
        case 'scrollbottom':
          scrollBottom();
        break;
        case 'collapselist':
          collapseList();
        break;
        case 'newboard':
          newBoard();
        break;
    }
  }

  function newBoard(){
    $('span.header-btn-icon.icon-lg.icon-add.light').click();

    setTimeout(function(){
      var elm = document.querySelector('a.js-new-board');
      elm.click();
    });

  }

  function moveCard() {
    if(card.length !== 1) return;

    card.find('span.list-card-operation').trigger('click');
    elm = document.querySelector('a.js-move-card');

    elm.click();
  }

  function copyCard() {
    if(card.length !== 1) return;

    card.find('span.list-card-operation').trigger('click');
    elm = document.querySelector('a.js-copy-card');

    elm.click();
  }

  function yank() {
    if(card.length !== 1) return;

    var url = $('.list-card-details > a', card)[0].href;
    url = url.substr(0, url.lastIndexOf('/'));
    console.log('Card:', url);
    flashMessage(card, 'Copied: ');

    chrome.extension.sendMessage({ text: url });
  }

  function moveCardUp() {
    if(card.length !== 1) return;

    card.find('span.list-card-operation').trigger('click');
    elm = document.querySelector('a.js-move-card');

    elm.click();
    $('.js-select-position').children().first().attr('selected', 'selected');
    $('input[value="Move"]').click();
  }

  function notifications() {
    document.querySelector('.header-notifications.js-open-header-notifications-menu').click();
  }

  function scrollTop() {
    var cardList = $(':hover').last().parents('.list').children('.list-cards');
    if(cardList){
      cardList.scrollTop(0);
    }
  }

  function scrollBottom() {
    var cardList = $(':hover').last().parents('.list').children('.list-cards');
    if(cardList){
      cardList.scrollTop(cardList.height() + 500); //Just to make sure we get the entire height
    }
  }

  function flashMessage(card, message){
    var position = card.offset();
    $('body').append('<div id="floatingDiv">' + message + '</div>');
    $("#floatingDiv").css({
      "position": "absolute",
      "top": position.top + 5,
      "left": position.left + (card.width() / 3),
      "color": "white",
      "background-color": "rgba(40, 50, 75, 0.65)",
      "padding": "5px",
      "display": "block",
      "z-index": 9999
    })
    .fadeIn(function(){
      $("#floatingDiv").fadeOut(function(){
        $("#floatingDiv").remove();
      })
    });
  }

  function collapseList(){
    var cardList = $(':hover').last().parents('.list');
    if(!cardList){
        return;
    }

    var prevHeight = cardList.attr('prevHeight');
    if(prevHeight){
      cardList.animate({ height: prevHeight});
      cardList.removeAttr('prevHeight');
    }
    else {
      var height = cardList.height();
      cardList.attr('prevHeight', height);
      cardList.animate({ height: '67px'});
    }
  }

});
