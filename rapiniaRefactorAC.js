var tiempoLimite = 60;
var fabricarPiratas = true;
//NO CAMBIAR DE ACA PARA ABAJO
var tiempoLargo = 1000;
var tiempoCorto = 100;
var expirar = true;
var captchaSolution = {idCaptcha : null , solucion : null};
var hudika = null;

function existeID(nombreID) {
	return document.getElementById(nombreID)!==null;
}

function obtenerID(nombreID) {
    return document.getElementById(nombreID);
}

function run() {
    if(hudika === null) {
        hudika = new Hudika();
        hudika.loguear("Scrip iniciando...");
    }
    ponerEnCondiciones()
    .then(accionarRapinia)
    .then(finalizar)
    .catch(()=>run())
}

function finalizar() {
    hudika.loguear("Mision de rapinia iniciada");
	if(existeID("captcha")) {
        hudika.loguear("Resolviendo captcha...");
        setTimeout(atenderCaptchav2,5000);
	}else {
        hacerPiratas();
        esperarCondicion(()=>{return !existeID("missionProgressBar")},tiempoLargo,!expirar,tiempoLimite).then(run);
	}	
}

function accionarRapinia() {
    var fortalezaMenu = obtenerID("pirateFortress");
    var columnaDeBotones = fortalezaMenu.getElementsByClassName("action");
    var botonAClickear = columnaDeBotones[1].getElementsByClassName("button capture")[0];
    if(botonAClickear !== null)
        setTimeout(()=>{botonAClickear.click()},1000);
    return esperarCondicion(function(){return(existeID("missionProgressBar") || existeID("captcha"))},tiempoCorto,expirar,10);
}

function esperarCondicion(condicionACumplir,tiempoMsEntreEjecucion,expirable,tiempoAExpirar,...args) {
    return new Promise((resolve,reject) => {
        var tiempoRestante = tiempoAExpirar*1000;
        var ejecutor = setInterval(function(){
            if(condicionACumplir(...args)) {
                clearInterval(ejecutor);
                resolve();
            } else if(expirable && tiempoRestante<0){
                clearInterval(ejecutor);
                reject();
            } else {
                tiempoRestante -= tiempoMsEntreEjecucion;
            }
        },tiempoMsEntreEjecucion);
    })
}

function abrirMenu(elementoClickeable, menuID) {
    elementoClickeable.click();
    return esperarCondicion(existeID,tiempoLargo,expirar,tiempoLimite,menuID);
}

function cerrarMenu(elementoClickeable, menuID) {
    elementoClickeable.click();
    return esperarCondicion(function(menuNombre){return !existeID(menuNombre)},tiempoCorto,expirar,tiempoLimite,menuID);
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
        return new Promise((resolve,reject)=>{resolve()});
    }
}

function hacerPiratas() {
	if(fabricarPiratas && !hayPiratasHaciendose()) {
        hudika.loguear("Produccion de piratas iniciada");
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
	return document.getElementById("ongoingConversion")!==null;
}
//----------------------WEB PART
function prepararImagenParaEnviar() {
    return new Promise((response, reject) => {
        var image = document.getElementsByClassName('captchaImage')[0];
        image.crossOrigin = 'Anonymous';
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.height = image.naturalHeight;
        canvas.width = image.naturalWidth;
        context.drawImage(image,0,0);
        var dataURL = canvas.toDataURL('image/png');
        return response(dataURL);
    })
}

function enviarCaptcha(apiKey, metodo, img64){
    var data = {key: apiKey, method: metodo, body: img64, header_acao: 1};
    return fetch('https://2captcha.com/in.php', {
      method: "POST",
      body: JSON.stringify(data)
    });
}

function atenderCaptchav2() {
    var method='base64';
    var apiKey='140cc084101706e4476413925a9d9b09';
    reiniciarCaptchaSolution();
    prepararImagenParaEnviar()
    .then(imgBase64 => enviarCaptcha(apiKey,method,imgBase64))
    .then(response => response.text())
    .then(data => wrapFunctionIntoPromise(() => captchaSolution.idCaptcha = getInfo(data)))
    .then(() => esperarSolucion())
    .then(() => ponerSolucionCaptcha())
    .then(() => getBotonAbordarCaptcha().click());
}

function esperarSolucion() {
    var apiKey='140cc084101706e4476413925a9d9b09';
    setTimeout(getCaptchaResuelto,8000,apiKey,captchaSolution.idCaptcha)
    return esperarCondicion(function(){return captchaSolution.solucion!==null},tiempoLargo,!expirar,tiempoLimite);
}

function ponerSolucionCaptcha() {
    var urlAnterior = document.getElementsByClassName("captchaImage")[0].attributes.src;
    getBotonAbordarCaptcha().onclick = function() {
                                esperarCondicion(function(){return(existeID("missionProgressBar") || otroCaptcha(urlAnterior))},tiempoCorto,expirar,tiempoLimite)
                                .then(finalizar)
                            };
    obtenerID('captcha').value = captchaSolution.solucion;
    return esperarCondicion(function(){return obtenerID('captcha').value.length!==0;},tiempoCorto,!expirar,tiempoLimite);
}

function getCaptchaResuelto(apiKey, idCaptcha) {
    var data = {key: apiKey, action: 'get', id: idCaptcha, header_acao : 1};
    var url = new URL('https://2captcha.com/res.php');
    Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
    fetch(url,{method: "GET"})
    .then(response => response.text())
    .then(data => procesarRespuestaCaptchaResulto(data,apiKey,idCaptcha));
}

function getInfo(respuesta) {
    return respuesta.substring(respuesta.indexOf('|')+1, respuesta.length);
}

function reiniciarCaptchaSolution() {
    captchaSolution = {idCaptcha : null , solucion : null};
}

function getBotonAbordarCaptcha() {
    var fortalezaMenu = obtenerID("pirateFortress");
    var botonAbordar = document.getElementsByClassName("centerButton")[0].getElementsByTagName("input")[0];
    return botonAbordar;
}

function wrapFunctionIntoPromise(funcion) {
    return new Promise((resolve)=>{funcion();resolve()})
}

function procesarRespuestaCaptchaResulto(respuesta,apiKey,idCaptcha) {
    if(respuesta==='CAPCHA_NOT_READY') {
        setTimeout(getCaptchaResuelto,8000,apiKey,idCaptcha);
    } else if (respuesta==='ERROR_CAPTCHA_UNSOLVABLE'){
        hudika.loguear("No pudieron resolver captcha. Intentando con otro");
        captchaSolution.solucion = 'error'
    }else {
        captchaSolution.solucion = getInfo(respuesta);
    }
}

function Hudika() {
    this.body = document.querySelector('body');
    this.contenedor = document.createElement('div');
    this.status = document.createElement('p');
    this.logger = document.createElement('p');
    function inicializarContenedor(contenedor){
        contenedor.style.backgroundColor = 'white';
        contenedor.style.width = '500px';
        contenedor.style.height = '250px';
        contenedor.style.position = 'fixed';
        contenedor.style.zIndex = '900';
        contenedor.style.top = '60%';
        contenedor.style.left = '5%'; 
    };
    function inicializarStatus(status){
        status.style.border = 'solid'
        status.style.height = '96px';
        status.style.overflowY = 'scroll';
        status.style.padding = '2px';
    };
    function inicializarLogger(logger) {
        logger.style.border = 'solid red'
        logger.style.height = '136px';
        logger.style.overflowY = 'scroll';
        logger.style.padding = '2px';
    };
    inicializarContenedor(this.contenedor);
    inicializarStatus(this.status);
    inicializarLogger(this.logger);
    this.body.insertBefore(this.contenedor,this.body.firstChild);
    this.contenedor.append(this.status);
    this.contenedor.append(this.logger);
    this.loguear = function(texto){setTimeout(() => {
        var currentdate = new Date(); 
        var datetime = currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
        this.logger.append(datetime + " Log: " + texto);
        this.logger.appendChild(document.createElement('br'))
    },100)};
}