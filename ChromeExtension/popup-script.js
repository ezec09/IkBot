var botonParaActivar = document.getElementById("botonParaActivar");

botonParaActivar.onclick = function() {
	enviarMensajeABackground({msg: botonParaActivar.innerText});
	if(botonParaActivar.innerText == "Activar") {
		botonParaActivar.innerText = "Desactivar";
		guardar({'botonActivadoTexto': "Desactivar"},function(){});
	} else {
		botonParaActivar.innerText = "Activar";
		guardar({'botonActivadoTexto': "Activar"},function(){});
	}
}

function init(){
	chrome.storage.local.get("botonActivadoTexto",function(resultado){
		var botonActivadoTexto = resultado.botonActivadoTexto;
		if(botonActivadoTexto!=null) {
			botonParaActivar = document.getElementById("botonParaActivar");
			botonParaActivar.innerText = botonActivadoTexto;
		}
	});
}

function guardar(objeto,callback){
	chrome.storage.local.set(objeto,callback);
}

function enviarMensajeABackground(mensaje,response){
	chrome.runtime.sendMessage(mensaje,response);
}

init();
