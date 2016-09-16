/* AngeVierge-DeckSheetPrinting: contentscript.js
 * Copyright 2016 Masahito Omote. All rights reserved.
 * This script contains base64 PNG data converted from
 * https://ange-vierge.com/assets/download/ange_decksheet_1_8.pdf
 * and using PDFmake and IPA fonts(http://ipafont.ipa.go.jp/).
 */

var t=document.getElementById("myDeckCardView-list");
var u=t.getElementsByClassName("view-list");

uli = u.item(0).getElementsByTagName("li");

var ange_cards = [];
var ange_card_parameter = {};
for(var itr = 0; itr < uli.length; itr++)
{
  var item_number_block = uli.item(itr).getElementsByClassName("number-block");
  var item_number_text = item_number_block.item(0).innerText;
  var item_name_block = uli.item(itr).getElementsByClassName("name-block");
  var item_name_text = item_name_block.item(0).getElementsByTagName("a").item(0).innerText;
  var item_amount_block = uli.item(itr).getElementsByClassName("amo-block");
  var item_amount_regex = item_amount_block.item(0).innerText.match(/([0-9]+)\s枚/);
  var item_amount_text = item_amount_regex[1];

  var item_data_block = uli.item(itr).getElementsByClassName("data-block");
  var item_data_text = item_data_block.item(0).innerText;

  // https://ange-vierge.com/images/deck/card_icon_color1.png 蒼
  // https://ange-vierge.com/images/deck/card_icon_color2.png 黒
  // https://ange-vierge.com/images/deck/card_icon_color3.png 赤
  // https://ange-vierge.com/images/deck/card_icon_color4.png 白
  // https://ange-vierge.com/images/deck/card_icon_color5.png 緑
  var item_color_block = uli.item(itr).getElementsByClassName("color-block");
  var item_color_src = item_color_block.item(0).getElementsByTagName("img").item(0).src;
  if(item_color_src.search(/card_icon_color1/) > 0) {
    item_color = "blue";
  } else if(item_color_src.search(/card_icon_color2/) > 0) {
    item_color = "black";
  } else if(item_color_src.search(/card_icon_color3/) > 0) {
    item_color = "red";
  } else if(item_color_src.search(/card_icon_color4/) > 0) {
    item_color = "white";
  } else if(item_color_src.search(/card_icon_color5/) > 0) {
    item_color = "green";
  } else {
    alert("Internal Error:");
  }

  var item_data_type = "";
  var item_data_level = -1;
  var item_data_linkframe = -1;
  var item_data_power = -1;
  var item_data_guard = -1;

  if(item_data_text.search(/\[種類\]：PG/) > 0){
//    item_data_text.search(/\s+\[種類\]：(PG|AC|EX)\s+\[レベル\]：(\d+)/g)
//    item_data_type = "PG";
//    var result = item_data_text.match(/\s+\[種類\]：(PG)\s+\[レベル\]：(\d+)\s+\[フレーム\]：(\S+)/);
    var result = item_data_text.match(/\s+\[種類\]：(PG)\s+\[レベル\]：(\d+)/);
    item_data_type = result[1];
    item_data_level = result[2];

    if(item_data_level < 2) {
      result = item_data_text.match(/\[フレーム\]：(\S+)/);
      item_data_linkframe = result[1];
    } else {
      item_data_linkframe = -1;
    }
    result = item_data_text.match(/\[パワー\]：(\S+)\s+\[ガード\]：(\S+)/);
    item_data_power = result[1];
    item_data_guard = result[2];
  } else if (item_data_text.search(/\[種類\]：AC/) > 0){
    var result = item_data_text.match(/\s+\[種類\]：(AC)\s+\[レベル\]：(\d+)/);
    item_data_type = result[1];
    item_data_level = result[2];
    item_data_linkframe = -1;

    result = item_data_text.match(/\[パワー\]：\s+\[ガード\]：(\S+)/);
    item_data_power = -1;
    item_data_guard = result[1];
  } else if (item_data_text.search(/\[種類\]：EX/) > 0){
    var result = item_data_text.match(/\s+\[種類\]：(EX)\s+\[チャージ\]：(\d+)/);
    item_data_type = result[1];
    item_data_level = result[2];
    item_data_linkframe = -1;
    result = item_data_text.match(/\[パワー\]：(\S+)\s+\[ガード\]：(\S+)/);
    item_data_power = result[1];
    item_data_guard = result[2];
  } else {
    alert("Internal Error:");
  }
//  console.log(item_data_type + ":" + item_data_level + ":" + item_data_linkframe);
//  console.log(":" + item_data_power + ":" + item_data_guard);
//  console.log(item_data_text = item_data_block.item(0).innerText);
//  console.log(item_data_text = item_data_block.item(0).innerHTML);
  ange_card_parameter = new Object();
  ange_card_parameter.number = item_number_text;
  ange_card_parameter.name = item_name_text;
  ange_card_parameter.color = item_color;
  ange_card_parameter.amount = item_amount_text;
  ange_card_parameter.type = item_data_type;
  ange_card_parameter.level = item_data_level;
  ange_card_parameter.linkframe = item_data_linkframe;
  ange_card_parameter.power = item_data_power;
  ange_card_parameter.guard = item_data_guard;
  console.log(ange_card_parameter);
  ange_cards.push(ange_card_parameter);

  if(Number(item_amount_text) > 1){
    for(var i=1; i < Number(item_amount_text); i++) {
      ange_card_parameter = new Object();
      ange_card_parameter.number = item_number_text;
      ange_card_parameter.name = item_name_text;
      ange_card_parameter.color = item_color;
      ange_card_parameter.amount = item_amount_text;
      ange_card_parameter.type = item_data_type;
      ange_card_parameter.level = item_data_level;
      ange_card_parameter.linkframe = item_data_linkframe;
      ange_card_parameter.power = item_data_power;
      ange_card_parameter.guard = item_data_guard;
      ange_cards.push(ange_card_parameter);
    }
  }
}

chrome.runtime.sendMessage({ange_cards: ange_cards}, function(response) {
  console.log("tabid="+response.tabid);
});
