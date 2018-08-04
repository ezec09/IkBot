var idTab = null;

function reloadPage(tabID,infoCambiada, tab){
    if(tabID===idTab){
        cambiarColorActiveTab();
    }
}

function detenerScriptTabClose(tabID,infoCambiada){
    if(tabID===idTab) {
        idTab = null;
    }
}

function detenerScriptPorUser() {
    idTab = null;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.msg === "Activar") {
            getIdOfActiveTab();
            cambiarColorActiveTab();
        }else if(request.msg === "Desactivar") {
            detenerScriptPorUser();
        }
    });

function getIdOfActiveTab() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) { 
        idTab = tabs[0].id;
    });
}

function cambiarColorActiveTab() {
    chrome.tabs.executeScript({
        code: 'document.body.style.backgroundColor="red"'
    });
}

chrome.tabs.onUpdated.addListener(reloadPage);
chrome.tabs.onRemoved.addListener(detenerScriptTabClose);