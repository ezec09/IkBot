var idTab = null;
var tiempoVerificacion = 5;
var verificadorScriptOn = null;

function detenerScriptTabClose(tabID,infoCambiada){
    if(tabID===idTab) {
        guardar({'botonActivadoTexto': "Activar"},function(){});
        clearTimeout(inyectadorProceso);
        idTab = null;
    }
}

function detenerScriptPorUser() {
    clearTimeout(verificadorScriptOn);
    inyectarScript(idTab,'irACiudad.js')
    .then(()=> idTab = null);
   
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('mensaje recibido');
        if(request.msg === "Activar") {
            iniciarFarmeo();
        }else if(request.msg === "Desactivar") {
            detenerScriptPorUser();
        }else if(request.msg === "NoEnCiudad") {
            irACiudad();
        }else if(request.msg === "EnCiudad") {
            enCiudad();
        }
    });

function guardarIdDondeEjecutar() {
    return new Promise((resolve) => {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => { 
            idTab = tabs[0].id;
            resolve();
        });
    });
}

function inyectarScript(idDondeEjecutar, rutaScript) {
    return new Promise((resolve) => {
        chrome.tabs.executeScript(idDondeEjecutar,{file: rutaScript},()=>resolve());
    });
}

function iniciarFarmeo() {
    guardarIdDondeEjecutar()
    .then(() => inyectarScript(idTab,"comunicadorEstado.js"))
    .then(() => console.log('Script inyectado'));
}

function irACiudad() {
    inyectarScript(idTab,'irACiudad.js')
    .then(()=> setTimeout(inyectarScript,3000,idTab,"comunicadorEstado.js"));
}

function enCiudad() {
    inyectarScript(idTab,'enCiudad.js')
    .then(()=>  verificadorScriptOn = setTimeout(verificarScriptOn,tiempoVerificacion*1000));
}

function verificarScriptOn() {
    chrome.tabs.sendMessage(idTab,{msg: 'estasOn?'},function(response) {
        if(!response || response.msg !== 'Yeah') {
            console.log('No Ejecutandose');
            inyectarScript(idTab,"comunicadorEstado.js");
        }else if(response.msg === 'Yeah') {
            console.log('Ejecutandose');
            verificadorScriptOn = setTimeout(verificarScriptOn,tiempoVerificacion*1000);
        } 
    });
}

chrome.tabs.onRemoved.addListener(detenerScriptTabClose);

chrome.runtime.onInstalled.addListener(function() {
    guardar({'botonActivadoTexto': 'Activar'});
    guardar({'hacerPiratas': false});

});

function guardar(objeto,callback){
	chrome.storage.local.set(objeto,callback);
}
