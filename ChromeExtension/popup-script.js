var botonActivadoTexto;
var botonParaActivar = document.getElementById("botonParaActivar");

botonParaActivar.onclick = function() {
	chrome.runtime.sendMessage({msg: botonParaActivar.innerText},function(response){});
	if(botonParaActivar.innerText == "Activar") {
		botonParaActivar.innerText = "Desactivar";
		chrome.storage.local.set({'botonActivadoTexto': "Desactivar"},function(){});
	} else {
		botonParaActivar.innerText = "Activar";
		chrome.storage.local.set({"botonActivadoTexto": "Activar"},function(){});
	}
}

function init(){
	chrome.storage.local.get("botonActivadoTexto",function(resultado){
		botonActivadoTexto = resultado.botonActivadoTexto;
		if(botonActivadoTexto!=null) {
			botonParaActivar = document.getElementById("botonParaActivar");
			botonParaActivar.innerText = botonActivadoTexto;
		}
	});
}

init();
