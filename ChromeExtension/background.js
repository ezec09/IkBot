var idTab = null;
var tiempoVerificacion = 10;
var inyectadorProceso = null;

function detenerScriptTabClose(tabID,infoCambiada){
    if(tabID===idTab) {
        guardar({'botonActivadoTexto': "Activar"},function(){});
        clearTimeout(inyectadorProceso);
        idTab = null;
    }
}

function detenerScriptPorUser() {
    clearTimeout(inyectadorProceso);
    idTab = null;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('mensaje recibido');
        if(request.msg === "Activar") {
            iniciarId();
            chrome.tabs.executeScript({ file: 'start.js'})
        }else if(request.msg === "Desactivar") {
            detenerScriptPorUser();
        }else if(request.msg === "enCity") {
            chrome.tabs.executeScript({ file: 'encity-script.js'})
        }else if(request.msg === "goingCity") {
            setTimeout( chrome.tabs.executeScript,5000,{ file: 'encity-script.js'});
        }else if(request.msg === "scriptOn") {
            console.log('back - senial recibida');
            clearTimeout(inyectadorProceso);
            inyectadorProceso = setTimeout(chrome.tabs.executeScript,tiempoVerificacion*1000,{ file: 'start.js'});
        }
    });

function iniciarId() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) { 
        idTab = tabs[0].id;
    });
}

function guardar(objeto,callback){
	chrome.storage.local.set(objeto,callback);
}


chrome.tabs.onRemoved.addListener(detenerScriptTabClose);