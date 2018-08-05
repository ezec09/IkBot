var botonParaActivar = document.querySelector("#botonParaActivar");
var checkBoxPiratas = document.querySelector("#hacerPiratas");

botonParaActivar.onclick = function() {
	enviarMensajeABackground({msg: botonParaActivar.innerText});
	if(botonParaActivar.innerText == "Activar") {
		botonParaActivar.innerText = "Desactivar";
		permisoDeEdicion('none');
	}
	else {
		botonParaActivar.innerText = "Activar";
		permisoDeEdicion('auto');
	}
	guardar({'botonActivadoTexto': botonParaActivar.innerText});
}

checkBoxPiratas.onclick = function() {
	guardar({'hacerPiratas': checkBoxPiratas.checked});
}

function init(){
	obtener('botonActivadoTexto').then((resultado)=>initButton(resultado.botonActivadoTexto));
	obtener('hacerPiratas').then((resultado)=>{initcheckPiratas(resultado.hacerPiratas)});
}

function initcheckPiratas(valor) {
	checkBoxPiratas.checked = valor;
}

function initButton(texto) {;
	if(texto!=null) {
		botonParaActivar = document.querySelector("#botonParaActivar");
		botonParaActivar.innerText = texto;
		texto === 'Desactivar' ? permisoDeEdicion('none') : permisoDeEdicion('auto');
	}
}

function permisoDeEdicion(valor) {
	var edicion = document.querySelector('#edicion');
	edicion.style.pointerEvents = valor;
}

function guardar(objeto,callback){
	chrome.storage.local.set(objeto,callback);
}

function obtener(key) {
	return new Promise((resolve)=> {
		chrome.storage.local.get(key,(resultado)=>resolve(resultado));
	})
}

function enviarMensajeABackground(mensaje,response){
	chrome.runtime.sendMessage(mensaje,response);
}

init();
