chrome.extension.onMessage.addListener(
  function(message, sender, sendResponse) {

    // if the message has text then copy it to the clipboard
    if (message.hasOwnProperty('text')){
      var text = message.text;

      var input = document.getElementById('url');

      input.value = text;
      input.select();

      document.execCommand('copy', false, null);
    }

    sendResponse();
  });
