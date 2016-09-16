/* AngeVierge-DeckSheetPrinting: background.js
 * Copyright 2016 Masahito Omote. All rights reserved.
 * This script contains base64 PNG data converted from
 * https://ange-vierge.com/assets/download/ange_decksheet_1_8.pdf
 * and using PDFmake and IPA fonts(http://ipafont.ipa.go.jp/).
 */
/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */

var ange_cards = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  chrome.pageAction.show(sender.tab.id);
  ange_cards[sender.tab.id] = request.ange_cards;
  sendResponse({tabid:sender.tab.id});
});

chrome.pageAction.onClicked.addListener(function(tab){
    chrome.tabs.create({url:"index.html?tabid=" + tab.id},function(tab){
    });
});
