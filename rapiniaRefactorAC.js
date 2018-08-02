var tiempoAEsperarEnSegundos = 60;
//NO CAMBIAR DE ACA PARA ABAJO
var tiempoLargo = 1000;
var tiempoCorto = 100;
var expirar = true;
var captchaSolution = {idCaptcha : null , solucion : null};

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
    .catch(()=>run())
}

function finalizar() {
	if(existeID("captcha")) {
        setTimeout(atenderCaptchav2,5000);
	}else {
        esperarElemento(()=>{return !existeID("missionProgressBar")},tiempoLargo,!expirar).then(run);
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
        var ejecutor;
        var tiempoRestante = tiempoAEsperarEnSegundos*1000;
        ejecutor = setInterval(function(){
            if(condicionACumplir(...args)) {
                clearInterval(ejecutor);
                resolve();
            } else if(expiraTiempo && tiempoRestante<0){
                clearInterval(ejecutor);
                reject();
            } else {
                tiempoRestante -= tiempoMsEntreEjecucion;
            }
        },tiempoMsEntreEjecucion);
    })
}

function createDelay(tiempo) {
    return new Promise ((resolve) => {setTimeout(resolve,tiempo)});
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
        obtenerID("CPToCrewSubmit").click();
        return esperarElemento(existeID,tiempoCorto,expirar,"ongoingConversion");
    }).then(()=> {
        obtenerID("js_tabBootyQuest").click();
    });
}

//----------------------WEB PART
function imagenToBase64() {
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
    reiniciarCaptchaSolution();
    var method='base64';
    var apiKey='140cc084101706e4476413925a9d9b09';
    imagenToBase64()
    .then(function(imgBase64) {return enviarCaptcha(apiKey,method,imgBase64)})
    .then(response => response.text())
    .then(data =>{return new Promise((resolve,reject) => {
                                        captchaSolution.idCaptcha = getInfo(data); 
                                        return resolve();
                                    });
                })
    .then(() => {setTimeout(getCaptchaResuelto,8000,apiKey,captchaSolution.idCaptcha)
                return esperarElemento(function(){return captchaSolution.solucion!==null},tiempoLargo,!expirar);})
    .then(() => {
                var urlAnterior = document.getElementsByClassName("captchaImage")[0].attributes.src;
                var botonAbordar = getBotonAbordarCaptcha();
                botonAbordar.onclick = function(){
                    esperarElemento(function(){return(existeID("missionProgressBar") || otroCaptcha(urlAnterior))},tiempoCorto,expirar)
                    .then(finalizar).catch(()=>alert("error"))};
                obtenerID('captcha').value = captchaSolution.solucion;
                return esperarElemento(function(){return obtenerID('captcha').value.length!==0;},tiempoCorto,!expirar);
                })
    .then(() => getBotonAbordarCaptcha().click());
}

function getCaptchaResuelto(apiKey, idCaptcha) {
    var data = {key: apiKey, action: 'get', id: idCaptcha, header_acao : 1};
    var url = new URL('https://2captcha.com/res.php');
    Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));
    fetch(url,{method: "GET"})
    .then(response => response.text())
    .then(data => {
        if(data==='CAPCHA_NOT_READY') {
            setTimeout(getCaptchaResuelto,8000,apiKey,idCaptcha);
        } else if (data==='ERROR_CAPTCHA_UNSOLVABLE'){
            captchaSolution.solucion = 'error'
        }else {
            captchaSolution.solucion = getInfo(data);
        }
    })
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