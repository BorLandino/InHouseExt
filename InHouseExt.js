// ==UserScript==
// @name         InHouseChecker
// @namespace    ikeainhousedelivery.azurewebsites.net
// @version      0.6.1
// @description  try to take over the world!
// @author       vlgom
// @match        https://ikeainhousedelivery.azurewebsites.net/Shipment/PreparedShipment
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

var widgetText = '<span style="position:fixed;top: 50px; right: 1px;text-align:right;"><iframe id="linkForMaps" src="https://yandex.ru/map-widget/v1/" width=600 height=500 frameborder="2" allowfullscreen="true"></iframe><br><a style="background-color: white;color: black;border: 2px solid green;padding: 5px 5px;" id="wrongAddress" target="_blank" rel="noopener noreferrer" href="https://yandex.ru/maps">Yandex.Maps</a></span>'
var lnk = "https://yandex.ru/map-widget/v1/?"
var timerId;
var MEMO;
main();


function test(){
};

function ReplaceAddress(){
    var dataShipmentId = document.getElementById("address-shipment").value;
    var addressText = document.getElementById("address-text").value;
    insertComment(dataShipmentId,addressText + " " + MEMO,true);
}

function insertComment(dataShipmentId,comment,replace){
    //var orderId = dataset.orderId;
    var c = document.getElementById("shipment-comment-text-"+dataShipmentId).textContent
    if (c=="" || replace) {
        $("[data-shipment-id='"+dataShipmentId+"'][class='shipment-comment-open-dialog btn btn-link btn-sm']")[0].click();
        //console.log(b);
        document.getElementById("shipment-comment-area").value = comment;
        document.getElementById("shipment-comment-save").click();
        //document.getElementById("shipment-comment-save").click();
    }
}

function main() {
    'use strict';
    MEMO = prompt('Введите ваш MEMO для запуска скрипта',MEMO);
    if (MEMO != null) {
        //обновляем ссылки при первом запуске
        timeoutUpdateLinks();
        //добавляем виджет карты
        $('body').append(widgetText);
        //добавление события на обновление списка
        document.getElementById("filter-btn").addEventListener('click', timeoutUpdateLinks);
        //добавление события к изменению адреса
        document.getElementById("save-address-btn").addEventListener('click', ReplaceAddress);
    }
};

//задержка обновления ссылок
function timeoutUpdateLinks(){
    timerId = setInterval(updateLinks, 500);
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
        miniMap.src = lnk + e.target.href.split("?")[1];
        var dataShipmentId = e.target.getAttribute("id").split("shipment-checkcoord-")[1];
        console.log(document.getElementById("shipment-address-" + dataShipmentId).textContent);
        document.getElementById("wrongAddress").innerHTML=document.getElementById("shipment-address-" + dataShipmentId).textContent;
        document.getElementById("wrongAddress").href="https://yandex.ru/maps/?text=" + document.getElementById("shipment-address-" + dataShipmentId).textContent;
        return false;
    } );
    var chk = document.getElementsByClassName("small shipment-state-text-unverified");
    Array.from(chk).forEach(element => element.addEventListener('click', function(){insertComment(element.getAttribute("data-shipment-id"),MEMO,false)}));
}

