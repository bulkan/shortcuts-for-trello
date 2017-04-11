chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {

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

chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({
    url: "https://trello.com/*",
    active: true,
    lastFocusedWindow: true,
    status: "complete"
  }, function(tabs) {
    if (!tabs || !tabs.length) return;
    return chrome.tabs.sendMessage(tabs[0].id, { command: command });
  });
});
