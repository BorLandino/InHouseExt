// ==UserScript==
// @name         InHouseChecker
// @namespace    ikeainhousedelivery.azurewebsites.net
// @version      0.7
// @description  try to take over the world!
// @author       vlgom
// @match        https://ikeainhousedelivery.azurewebsites.net/Shipment/PreparedShipment
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://raw.githubusercontent.com/BorLandino/InHouseExt/main/InHouseExt.js
// @updateURL https://raw.githubusercontent.com/BorLandino/InHouseExt/main/InHouseExt.js
// ==/UserScript==

var widgetText = '<span id="extSpan" style="width:40%; height:50%; display:none; position:fixed;top: 1px; right: 1px;text-align:right;"><iframe id="linkForMaps" src="https://yandex.ru/map-widget/v1/" width=100% height=100% frameborder="2" allowfullscreen="true"/><br><input style="width: 100%; background-color: white;color: black;border: 2px solid green;padding: 5px 5px;" id="wrongAddress"/><div align=right><input id="datashipVal" style="display: none"/><button style="display: none;width=100px" id="savedNewAddressButton">Сохранить</button></span>'
var checkButton = '<button type="button" id="checkButton" class="btn btn-primary">Uncheck changes</button>'
var lnk = "https://yandex.ru/map-widget/v1/?"
var timerId;
var MEMO;
main();


function test(){
};

function ReplaceAddress(){
    var dataShipmentId = document.getElementById("address-shipment").value;
    var addressText = document.getElementById("address-text").value;
    insertComment(dataShipmentId,addressText + " " + MEMO,false);
}

function insertComment(dataShipmentId,comment,replace){
    //var orderId = dataset.orderId;
    var c = document.getElementById("shipment-comment-text-"+dataShipmentId).textContent
    if (c=="" || replace) {
        $("[data-shipment-id='"+dataShipmentId+"'][class='shipment-comment-open-dialog btn btn-link btn-sm']")[0].click();
        //console.log(b);
        document.getElementById("shipment-comment-area").value = comment;
        setTimeout(function(){document.getElementById("shipment-comment-save").click()}, 500);
    }
}

function main() {
    'use strict';
    MEMO = prompt('Введите ваш MEMO для запуска скрипта(0.6.3)',MEMO);
    if (MEMO != null && MEMO != "") {
        //обновляем ссылки при первом запуске
        timeoutUpdateLinks();
        //добавляем виджет карты
        $('body').append(widgetText);
        $('body').append(checkButton);
        //добавление события на обновление списка
        document.getElementById("filter-btn").addEventListener('click', timeoutUpdateLinks);
        //добавление события к изменению адреса
        document.getElementById("save-address-btn").addEventListener('click', ReplaceAddress);
        //добавление события в поле ввода адреса
        document.getElementById("wrongAddress").addEventListener('keyup',changeAddressHelper);
        document.getElementById("savedNewAddressButton").addEventListener('click',SaveByMiniMaps);
        document.getElementById("checkButton").addEventListener('click',unCheckAdr);
    }
};

function unCheckAdr(){
Array.from($("[class='small shipment-state-text-verified']")).forEach(function(element){
    var dataShipmentId = element.getAttribute("data-shipment-id");
    var com = document.getElementById("shipment-comment-text-"+dataShipmentId).textContent;
    if (com.length>10) {
        var v = $("[class='small shipment-state-text-verified'][data-shipment-id='"+dataShipmentId+"']")[0]
        if (v!=undefined){
            console.log(v);
            v.click();
        }
        //var pl = document.getElementById(
    }
});
}

//задержка обновления ссылок
function timeoutUpdateLinks(){
    timerId = setInterval(updateLinks, 500);
}

function SaveByMiniMaps(){
    var dataShipmentId = document.getElementById("datashipVal").value;
    $("[data-shipment-id='"+dataShipmentId+"'][class='btn tn-sm btn-primary address-dialog-btn']")[0].click();
    document.getElementById("address-text").value = document.getElementById("wrongAddress").value;
    setTimeout(function(){document.getElementById("save-address-btn").click()},750);
    console.log(t);
    "address-text"
    //"32e91383-c97e-4bfd-9460-08da6749bd52"
    //document.getElementById("wrongAddress").value
}

function updateLinks(){
  // Save it!
    var btn = document.getElementById("filter-btn");
    if(!(btn.textContent == "Поиск заказов")) {
        return false;
    };
    clearInterval(timerId);
    var miniMap = document.getElementById("linkForMaps");
    var TargetLink = $("a:contains('Проверить координаты')");
    $("a:contains('Проверить координаты')").click( function(e) {
        e.preventDefault();
        var miniMap = document.getElementById("linkForMaps");
        miniMap.src = lnk + e.target.href.split("?")[1] + "&z=17";
        var dataShipmentId = e.target.getAttribute("id").split("shipment-checkcoord-")[1];
        document.getElementById("datashipVal").value = dataShipmentId;
        //console.log(document.getElementById("shipment-address-" + dataShipmentId).textContent);
        document.getElementById("wrongAddress").value=document.getElementById("shipment-address-" + dataShipmentId).textContent;
        //document.getElementById("wrongAddress").href="https://yandex.ru/maps/?text=" + document.getElementById("shipment-address-" + dataShipmentId).textContent;
        return false;
    } );
    var chk = document.getElementsByClassName("small shipment-state-text-unverified");
    Array.from(chk).forEach(element => element.addEventListener('click', function(){insertComment(element.getAttribute("data-shipment-id"),MEMO,false)}));
}

var inputTimerId;
function changeAddressHelper(e){
    clearTimeout(inputTimerId);
    if (e.keyCode == 13){
        changeAddress();
    }else{
        inputTimerId = setTimeout(function(){changeAddress()},1000);
    }
}
function changeAddress() {
    //See notes about 'which' and 'key'
    var miniMap = document.getElementById("linkForMaps");
    miniMap.src = lnk +"text=" + document.getElementById("wrongAddress").value + "&z=17";
    //console.log(miniMap.src);
    var dataShipmentId = document.getElementById("datashipVal").value;
    console.log(dataShipmentId);
    if(document.getElementById("wrongAddress").value == document.getElementById("shipment-address-" + dataShipmentId).textContent){
        document.getElementById("savedNewAddressButton").style.display="none";
    }else{
        document.getElementById("savedNewAddressButton").style.display="block";
    }
    return false;
}

window.onscroll = function() {
  //console.log(window.pageYOffset);
  if (window.pageYOffset>150){
      document.getElementById("extSpan").style.display = 'block';
  }else{
      document.getElementById("extSpan").style.display = 'none';
  }
}

var bAlert = window.alert;
window.alert = function (text) {/*bAlert(text)*/; console.log(text); return true; };
//alert( new Date());
