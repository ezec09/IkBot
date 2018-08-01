var tiempoEntreExpedicion = 152000;

function abrirFortaleza() {
	if(!menuAbierto("pirateFortress")) {
		var fortalezaClickeable = document.getElementById("js_CityPosition17Link");
		fortalezaClickeable.click();
	}
}

function finalizar() {
	if(hayCaptcha()) {
		atenderCaptcha();
	}else {
		if(rapiniaEnEjecucion()) {
			var tiempoRestante = obtenerTiempoRestante()*1000;
			setTimeout(mandarExpedicion,tiempoRestante+2000);
			/*hacerPiratas();*/
		} else {
			mandarExpedicion();
		}
		
	}	
}

function accionarRapinia() {
	if(menuAbierto("pirateFortress")) {
		var fortalezaMenu = document.getElementById("pirateFortress");
		var columnaDeBotones = fortalezaMenu.getElementsByClassName("action");
		var botonAClickear = columnaDeBotones[1].getElementsByClassName("button capture")[0];
		botonAClickear.click();
		setTimeout(finalizar,1500); 
	} else {
		setTimeout(accionarRapinia,100);
	}
}

function cerrarRapinia() {
	if(menuAbierto("pirateFortress")) {
		var fortalezaMenu = document.getElementById("pirateFortress");
		var botonCerrar = fortalezaMenu.getElementsByClassName("close")[0];
		botonCerrar.click();
	}
}

function atenderCaptcha() {
	window.confirm("Solucionar Captcha");
	var fortalezaMenu = document.getElementById("pirateFortress");
	var botonAbordar = document.getElementsByClassName("centerButton")[0].getElementsByTagName("input")[0];
	botonAbordar.onclick = function(){setTimeout(finalizar,1500)};
}

function mandarExpedicion() {
	cerrarRapinia();
	setTimeout(abrirFortaleza,1000);
	setTimeout(accionarRapinia,2000);
}

function run() {
	mandarExpedicion();
}

function irALaCiudad() {
	var divCiudad = document.getElementById("js_cityLink");
	var botonCiudad = divCiudad.getElementsByTagName("a")[0];
	botonCiudad.click();
}

function menuAbierto(idMenu) {
	return document.getElementById(idMenu) != null;
}

function hacerPiratas() {
	abrirFortaleza();
	if(!hayPiratasHaciendose()) {
		setTimeout(abrirMenuTripulacion,2000);
		setTimeout(maximizarBarraYActivar,3000);
		setTimeout(abrirMenuRapinia,4000);
	}
}

function abrirMenuRapinia() {
	document.getElementById("js_tabBootyQuest").click();
}

function abrirMenuTripulacion() {
	document.getElementById("js_tabCrew").click();
}

function maximizarBarraYActivar() {
	document.getElementById("CPToCrewSliderMax").click();
	setTimeout(document.getElementById("CPToCrewSubmit").click(),1000);
}

function hayPiratasHaciendose() {
	return document.getElementById("ongoingConversion")!=null;
}

function rapiniaEnEjecucion(){
	return document.getElementById("missionProgressTime")!=null
}

function hayCaptcha() {
	return document.getElementById("captcha") != null;
}

function obtenerTiempoRestante() {
	var tiempoString = document.getElementById("missionProgressTime").innerText;
	var soloNumeros = tiempoString.replace(' ','').replace('m','').replace('s','');;
	var segundosRestantes = 0;
	var minutosrestantes = 0;
	if(soloNumeros.length === 3) {
		minutosrestantes = Number(soloNumeros[0]);
	}
	segundosRestantes = (Number(soloNumeros.substr(soloNumeros.length-2,2)));

	return minutosrestantes*60+segundosRestantes;
}
