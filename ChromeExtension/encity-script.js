var tiempoSenialDeVida = 5;

function mandarSenialDeVida() {
    enviarMensajeABackground({msg: "scriptOn"});
    setTimeout(mandarSenialDeVida,5000);
}

function enviarMensajeABackground(mensaje,response){
	chrome.runtime.sendMessage(mensaje,response);
}


mandarSenialDeVida();