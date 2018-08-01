var tiempoAEsperarEnSegundos = 60;
var tiempoLargo = 1000;
var tiempoCorto = 100;
var expirar = true;

function existeID(nombreID) {
	return document.getElementById(nombreID)!==null;
}

function obtenerID(nombreID) {
    return document.getElementById(nombreID);
}

function run() {
    ponerEnCondiciones()
    .then(accionarRapinia)
    .then(finalizar)
    .catch(()=>alert("error"))
}

function finalizar() {
	if(existeID("captcha")) {
		atenderCaptcha();
	}else {

        esperarElemento(()=>{return !existeID("missionProgressBar")},tiempoLargo,!expirar).then(run).catch(()=>alert('error'));
	}	
}

function atenderCaptcha() {
    window.alert("Solucionar Captcha");
    var urlAnterior = document.getElementsByClassName("captchaImage")[0].attributes.src;
	var fortalezaMenu = obtenerID("pirateFortress");
	var botonAbordar = document.getElementsByClassName("centerButton")[0].getElementsByTagName("input")[0];
    botonAbordar.onclick = function(){
        esperarElemento(function(){return(existeID("missionProgressBar") || otroCaptcha(urlAnterior))},tiempoCorto,expirar)
        .then(finalizar)
        .catch(()=>alert("error"))
    };
}

function accionarRapinia() {
    var fortalezaMenu = obtenerID("pirateFortress");
    var columnaDeBotones = fortalezaMenu.getElementsByClassName("action");
    var botonAClickear = columnaDeBotones[1].getElementsByClassName("button capture")[0];
    setTimeout(()=>{botonAClickear.click()},1000);
    return esperarElemento(function(){return(existeID("missionProgressBar") || existeID("captcha"))},tiempoCorto,expirar);
}

function esperarElemento(condicionACumplir,tiempoMsEntreEjecucion,expiraTiempo,...args) {
    return new Promise((resolve,reject) => {
        var numeroDeVeces = 0;
        setInterval(function() {   
            if(condicionACumplir(...args)) {
                clearInterval(this);
                return resolve();
            } else if(expiraTiempo && numeroDeVeces>tiempoAEsperarEnSegundos*10){
                clearInterval(this);
                return reject();
            } else {
                numeroDeVeces++;
            }
        },tiempoMsEntreEjecucion)  
    })
}

function abrirMenu(elementoClickeable, menuID) {
    elementoClickeable.click();
    return esperarElemento(existeID,tiempoLargo,expirar,menuID);
}

function cerrarMenu(elementoClickeable, menuID) {
    elementoClickeable.click();
    return esperarElemento(function(menuNombre){return !existeID(menuNombre)},tiempoCorto,expirar,menuID);
}

function cerrarMenuRapinia() {
    var fortalezaMenu = document.getElementById("pirateFortress");
    var botonCerrar = fortalezaMenu.getElementsByClassName("close")[0];
    return cerrarMenu(botonCerrar,"pirateFortress");
}

function abrirMenuRapinia() {
	var botonFortaleza = document.getElementById("js_CityPosition17Link");
    return abrirMenu(botonFortaleza,"pirateFortress")
}

function otroCaptcha(urlAnterior){
    try {
        var captchaImagen = document.getElementsByClassName("captchaImage");
        return captchaImagen[0].attributes.src !== urlAnterior
    }catch(ex) {
        return false;
    }
}

function ponerEnCondiciones() {
    if(!existeID("pirateFortress")) {
        return abrirMenuRapinia();
    } else {
        return new Promise((resolve,reject)=>{return resolve()});
    }
}

function hacerPiratas() {
    obtenerID("js_tabCrew").click();
    esperarElemento(existeID,tiempoCorto,expirar,"CPToCrewInput")
    .then(() => {
        setTimeout(()=>{obtenerID("CPToCrewSliderMax").click();},2000);
         return esperarElemento(function() {
            return Number(document.getElementsByClassName("sliderbg")[0].attributes.title.value)!==0;
        },tiempoCorto,expirar)
    }).then(() => {
        document.getElementById("CPToCrewSubmit").click();
        return esperarElemento(existeID,tiempoCorto,expirar,"ongoingConversion");
    }).then(()=> {
        obtenerID("js_tabBootyQuest").click();
    }).catch(()=> alert("ERROR"));
}

run();