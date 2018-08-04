function analizarDondeEsta(){
    if(document.querySelector('#js_CityPosition0Link')!==null){
        enviarMensajeABackground({msg: 'enCity'});
    }else {
        irACiudad();
        enviarMensajeABackground({msg: 'goingCity'});
    }
}

function irACiudad(){
    var botonCiudad = document.querySelector("#js_cityLink").querySelector("a");
    botonCiudad.click();
}

function enviarMensajeABackground(mensaje,response){
	chrome.runtime.sendMessage(mensaje,response);
}

analizarDondeEsta();
