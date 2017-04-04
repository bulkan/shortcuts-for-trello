/* global chrome */

chrome.extension.sendMessage({}, function() {

  var elm, card, readyStateCheckInterval;

  readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      chrome.runtime.onMessage.addListener(routeCommand);
    }
  }, 3);

  function routeCommand(request) {
    card = getCurrentCard();

    switch(request.command) {
        case 'movecard':
          moveCard();
        break;
        case 'movecardup':
          moveCardUp();
        break;
        case 'movecarddown':
          moveCardDown();
        break;
        case 'copycard':
          copyCard();
        break;
        case 'yank':
          yank();
        break;
        case 'movecardtop':
          moveCardTop();
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
        case 'newchecklist':
          newChecklist();
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

  function moveCardUp() {
    if(card.length !== 1) return;

    var prevCard = card.prev('.list-card');

    if(prevCard) {
      $(card).insertBefore(prevCard);
    }
  }

  function moveCardDown() {
    if(card.length !== 1) return;

    var nextCard = card.next('.list-card');

    if(nextCard) {
      $(card).insertAfter(nextCard);
    }
  }

  function copyCard() {
    if(card.length !== 1) return;

    card.find('span.list-card-operation').trigger('click');
    elm = document.querySelector('a.js-copy-card');

    elm.click();
  }

  function yank() {
    if(card.length !== 1) return;

    if (card.selector == ".card-detail-window") {
      short_url = getURLFromDetailedCardWindow();
    } else if (card.selector == ".active-card") {
      short_url = getURLFromActiveCard(card);
    } else {
      console.log("No card to copy Short URL from");
      return;
    }

    console.log('Card:', short_url);
    flashMessage(card, 'Copied: ' + short_url);

    chrome.extension.sendMessage({ text: short_url });
  }

  function moveCardTop() {
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
      "padding": "15px",
      "display": "block",
      "z-index": 9999
    })
    .fadeIn(1000, function(){
      $("#floatingDiv").fadeOut(1500, function(){
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

  function getCurrentCard(){
    active_card = $('.active-card')
    detailed_card_window = $('.card-detail-window');

    if (detailed_card_window.size() == 1) {
      return detailed_card_window;
    } else if (active_card.size() == 1) {
      return active_card;
    } else {
      return {lenght: 0};
    }
  }

  function getURLFromActiveCard(card) {
    var a = $('.list-card-details > a', card)[0].href;
    return a.substr(0, a.lastIndexOf('/'));
  }

  function getURLFromDetailedCardWindow() {
    var a = document.createElement("a");
    a.href = $(location).attr("href");
    pathname = a.pathname.split("/");
    pathname.pop();

    var path_to_card = pathname.join("/");
    return a.origin + "/" + path_to_card;
  }

  function newChecklist(){
    if (card.length !== 1) return;

    // @TODO: have a dictionary of elements instead of hardcoding strings
    var element = findByClass("js-add-checklist-menu");
    clickOn(element);
  }

  // @TODO: these are helper functions. Move them (and any other helpers) away from here.
  function clickOn(element) {
    var event = new MouseEvent("click", {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });

    var cancelled = !element.dispatchEvent(event);

    if (cancelled) {
      // A handler called preventDefault.
    } else {
      // None of the handlers called preventDefault.
    }
  }

  function findByClass(className) {
    var element = document.getElementsByClassName(className);
    return element[0];
  }
});
