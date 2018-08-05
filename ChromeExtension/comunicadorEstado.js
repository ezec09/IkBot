function enviarMensajeABackground(mensaje,response){
	chrome.runtime.sendMessage(mensaje,response);
}

function comunicarEstado() {
    if(document.querySelector('#js_CityPosition0Link'))
        enviarMensajeABackground({msg: 'EnCiudad'});
    else
        enviarMensajeABackground({msg: 'NoEnCiudad'});
}

comunicarEstado();