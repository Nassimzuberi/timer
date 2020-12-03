// LES BOUTONS PRINCIPALES
const btn30sec = document.getElementById("btn-30sec");
const btn5min= document.getElementById("btn-5min");
const btn15min= document.getElementById("btn-15min");
const btn20min= document.getElementById("btn-20min");
const btn1h= document.getElementById("btn-1h");
const btnChoice = document.getElementsByClassName("btn-choice")[0];

// FORM
const form = document.getElementById("chrono-form")

//CHRONO-SHOW
const chrono = document.getElementsByClassName("chrono")[0]
const timeHTML = document.getElementById("time");
const timeLimit = document.getElementById("time-limit");
const btnReset = document.getElementById("btn-reset");

function hide(div) {
    div.style.transition = "all 0.2s";
    div.style.opacity = "0";
    setTimeout(() => {
        div.style.display = "none";
    },200)
}

function show(div) {
    div.style.opacity != 0 && (div.style.opacity = 0);
    div.style.display = "flex"
    setTimeout(() => {
        div.style.transition = "all 0.2s"
        div.style.opacity = "1"
    },200)
}

let chronotime = {hour:0, min:0,second:0}
let interval,alertTimeout;

btn30sec.addEventListener('click',() => onClick({hour:0,min:0,second:30}))
btn5min.onclick =() => onClick({hour:0,min:5,second:0})
btn15min.onclick =() => onClick({hour:0,min:15,second:0})
btn20min.onclick =() => onClick({hour:0,min:20,second:0})
btn1h.onclick =() => onClick({hour: 1,min:0,second:0})

// Restriction formultaire
form[0].addEventListener("input", () => {
    if(parseInt(form[0].value) >= 24){
        form[0].value = 23;
    }
    else if(parseInt(form[0].value) < 0) {
        form[0].value = 0;
    }
})
form[1].addEventListener("input", () => {
    if(parseInt(form[1].value) >= 60){
        form[1].value = 59;
    }
    else if(parseInt(form[1].value) < 0) {
        form[1].value = 0;
    }
})
form[2].addEventListener("input", () => {
    if(parseInt(form[2].value) >= 60){
        form[2].value = 59;
    }
    else if(parseInt(form[2].value) < 0) {
        form[2].value = 0;
    }
})

form.onsubmit = (e) => {
    e.preventDefault();
    let time = {second: 0,min: 0, hour:0};
    let hour = form[0].value ? parseInt(form[0].value) : 0;
    let min = form[1].value ? parseInt(form[1].value) : 0;
    let sec = form[2].value ? parseInt(form[2].value) : 0;

    // SI LE FORMULTAIRE N'EST PAS REMPLI AU MOINS DANS l'UN DES INPUTS
    if(form[0].value != "" | form[1].value != ""  | form[2].value != "" ) {

        // Si les nombres rentrés sont naturels
        if(hour >= 0 && min >= 0 && sec >= 0){
            time.hour = hour;
            time.min = min;
            time.second = sec;
            onClick(time);
            form.reset();
        }
    }
}

// Clique qui lance le chronomètre
function onClick (time){
    hide(btnChoice);
    chronotime = time;
    showLimit();
    launchChrono()
}

// Affiche l'heure de retour
function showLimit () {
    const time = chronotime;
    const date = new Date();
    time.second && (date.setSeconds(date.getSeconds() + time.second));
    time.min && (date.setMinutes(date.getMinutes() + time.min));
    time.hour && (date.setHours(date.getHours() + time.hour));
    timeLimit.textContent = " Revenez à " + date.getHours() + "h" + date.getMinutes() ;
    return date;
}

// Affiche le chrono et commence l'interval qui
function launchChrono() {
    showTime();
    interval = setInterval(launch,1000);
}

// Descend d'une seconde
function launch(){
    let time = chronotime
    if(time.hour == 0 && time.min == 0 && time.second == 0) {
        clearInterval(interval);
        alertTimeout = setTimeout(alert,60000);
        timeHTML.classList.add("end");
    }else {
        time.second > 0 && (time.second -= 1)
        if(time.second == 0 && (time.min > 0 || time.hour > 0)) {
            time.second = 59;
            time.min > 0 && (time.min -=1);
            if(time.min == 0 && (time.hour > 0)) {
                time.min = 59;
                time.hour -= 1;
            }
        }
    }
    showTime()
}
// Affiche le message d'alerte quand le compte à rebours n'est pas reset
const alert = () => {timeLimit.innerHTML = " <span class='alert'> Vous êtes en retard !!! </span>"}

// Affiche le chrono
function showTime() {
    let time = chronotime;
    timeHTML.textContent = (time.hour) + ":" + (time.min< 10 ? "0" + time.min : time.min) + ":" + (time.second < 10 ? "0" + time.second : time.second);
}


// AU CLIQUE SUR LE BOUTON RESET
btnReset.addEventListener('click',reset);

// Reinitialise tout
function reset() {
        clearInterval(interval);
        clearTimeout(alertTimeout);
        chronotime = {hour: 0, min: 0, second: 0};
        showTime();
        timeLimit.textContent = "";
        timeHTML.classList.contains("end") && (timeHTML.classList.remove("end"));
        show(btnChoice);
        if(btnStop.classList.contains("stop")){
            btnStop.classList.remove("stop");
            btnStop.textContent = "Pause";
        }
    }

// Au clique sur le bouton stop

const btnStop = document.getElementById("btn-stop");

// Bouton pause
btnStop.addEventListener("click",pause);

function pause () {
    if(chronotime.hour != 0 | chronotime.min != 0 | chronotime.second != 0){
        if(btnStop.classList.contains("stop")){
            interval = setInterval(launch,1000);
            btnStop.textContent = "Pause"
            showLimit();
            btnStop.classList.remove('stop')
        } else {
            btnStop.classList.add('stop');
            btnStop.textContent = "Relancer";
            clearInterval(interval);
            timeLimit.textContent = "Minuteur en pause";
        }
    }
}