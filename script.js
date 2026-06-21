let alarmAudio = new Audio("assets/alarm.mp3");
alarmAudio.loop = true;

if ("Notification" in window) {

    Notification.requestPermission();

}

if(!sessionStorage.getItem("login")){

    sessionStorage.setItem(
        "redirectAfterLogin",
        window.location.href
    );

    window.location.href =
        "index.html";

}

function showBrowserNotification(judul, pesan){

    if(Notification.permission === "granted"){

        new Notification(judul,{
            body: pesan,
            icon: "assets/logo-clean.png"
        });

    }

}

function showNotification(pesan){


    alarmAudio.pause();
    alarmAudio.currentTime = 0;

    alarmAudio.play();

    Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: pesan,
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonText: 'OK'
    }).then(() => {

        alarmAudio.pause();
        alarmAudio.currentTime = 0;

    });

}


const namaUser = {

    "fakhrimuhammad" :
        "Dr. Fakhri Muhammad A.Md.Kep",

    "ihsanmuhammad" :
        "Dr. Ihsan Muhammad S.T",

    "muhidin" :
        "Muhidin, S.T., M,T",

    "sarahchairulannisa" :
        "Sarah Chairul Annisa, S.Pd., M.T",

    "afhamramadhan" :
        "Afham Ramadhan, S.Si., M.T",

    "ariefgoeritno" :
        "H. Arief Goeritno S.T., M.T",

    "jokiirawan" :
        "Dipl. Ing. Joki Irawan, S.T.",

    "fithrimuliawati" :
        "Fithri Muliawati, S.T., M. Pd., M.T.",

    "opamustopa" :
        "Opa Mustopa, S.T.",

    "maswan" :
        "Maswan, S.T.",

    "suratun" :
        "Hj. Suratun, Ir., M. Si",

    "iwansumirat" :
        "Eng. Iwan Sumirat, S.Si., M.Eng",

    "agilmiraj" :
        "Agil Miraj"

};

const userLogin =
    sessionStorage.getItem("user");

if(userLogin){

document.getElementById("welcomeUser").innerHTML =
    "Selamat Datang, <b>" +
    namaUser[userLogin] +
    "</b>";

}

const tpmData = [];
const setpointData = [];
const labels = [];

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    onValue,
    off,
    set
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCutYwSFM-PN01PuzDYL-vFHPhZMfNrcRo",
    authDomain: "dripguard-01.firebaseapp.com",
    databaseURL: "https://dripguard-01-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dripguard-01",
    storageBucket: "dripguard-01.firebasestorage.app",
    messagingSenderId: "722166314098",
    appId: "1:722166314098:web:2547accb62d4d3222afeeb"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentRef = null;
let pasienAktif = "pasien_01";
let lastData = null;
let statusPasien = {};
let alarmShown = {
    LOW: false,
    LOW2: false,
    EMPTY: false,
    BLOCK: false
};


// ============================
// CHART
// ============================

const ctx = document.getElementById("tpmChart");

const tpmChart = new Chart(ctx, {

    type: "line",

    data: {
        labels: labels,
        datasets: [

            {
                label: "TPM Aktual",
                data: tpmData,
                borderColor: "#0d6efd",
                backgroundColor: "rgba(13,110,253,0.15)",
                fill: true,
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
},

            {
                label: "Setpoint",
                data: setpointData,
                borderColor: "#dc3545",
                borderWidth: 2,
                borderDash: [10,5],
                pointRadius: 0,
                tension: 0
            }

        ]
    },

    options: {

        responsive: true,

        animation: false,

        scales: {
            y: {
                min: 0,
                max: 60,
                ticks: {
                    stepSize: 10
                }
            }
        }

    }

});


// ============================
// UPDATE DASHBOARD
// ============================

function updateDashboard(data){

    if(!data) return;

    const sekarang = Date.now() / 1000;;
    const selisih = sekarang - data.lastSeen;

    // Judul pasien

    document.querySelector(".card h2").innerHTML =
        pasienAktif.replace("_"," ").toUpperCase();

    // Alarm

    const banner =
    document.getElementById("alarmBanner");

if(data.status === "LOW"){
    banner.style.display = "block";
    banner.innerHTML = "⚠ INFUS RENDAH";
}

else if(data.status === "LOW!!"){
    banner.style.display = "block";
    banner.innerHTML = "⚠ INFUS SANGAT RENDAH";
}

else if(data.status === "EMPTY"){
    banner.style.display = "block";
    banner.innerHTML = "⚠ INFUS HABIS";
}

else if(data.status === "BLOCK"){
    banner.style.display = "block";
    banner.innerHTML = "⚠ INFUS MACET";
}

else{
    banner.style.display = "none";
}


// ============================
// ONLINE OFFLINE BERDASARKAN LASTSEEN
// ============================

const deviceStatus =
    document.getElementById("deviceStatus");


if (selisih < 5) {

    deviceStatus.innerHTML =
    "🟢 PERANGKAT ONLINE";

    deviceStatus.className =
    "device-online";

} else {

    deviceStatus.innerHTML =
    "🔴 PERANGKAT OFFLINE";

    deviceStatus.className =
    "device-offline";

}
    // Data utama

    document.getElementById("berat").innerHTML =
        data.berat + " gram";

    document.getElementById("persen").innerHTML =
        data.persen + "%";

    document.getElementById("tpm").innerHTML =
        data.tpm;

    document.getElementById("setpoint").innerHTML =
        data.setpoint;

    document.getElementById("servo").innerHTML =
        data.servo + "°";

/*    const errorTPM =
     Math.abs(data.tpm - data.setpoint);

    document.getElementById("errorTPM").innerHTML =
     errorTPM;
    
    document.getElementById("lastUpdate").innerHTML =
     Math.floor(selisih) + "s";
*/
    // Status

    const statusEl =
        document.getElementById("status");

    statusEl.innerHTML =
        data.status;

    statusEl.className = "";

if(data.status === "FULL"){
    statusEl.classList.add("status-full");
}

else if(data.status === "HALF"){
    statusEl.classList.add("status-half");
}

else if(data.status === "LOW"){
    statusEl.classList.add("status-low");
}

else if(data.status === "LOW!!"){
    statusEl.classList.add("status-low2");
}

if(data.status === "NORMAL"){
    statusEl.classList.add("status-normal");
}

else if(data.status === "BLOCK"){
    statusEl.classList.add("status-block");
}

else if(
    data.status === "INFUS HABIS" ||
    data.status === "EMPTY"
){
    statusEl.classList.add("status-empty");
}

else if(data.status === "SETUP"){
    statusEl.classList.add("status-setup");
}
/*
else if(data.status === "INFUS HABIS" ||
    data.status === "EMPTY"
){

    statusEl.classList.add("status-empty");
}
*/
else if(data.status === "BLOCK"){
    statusEl.classList.add("status-block");
}

else if(data.status === "SETUP"){
    statusEl.classList.add("status-setup");
}

// ============================
// POPUP ALARM
// ============================



if(data.status === "LOW" && !alarmShown.LOW){

    alarmShown.LOW = true;

    showNotification(
        "⚠ Infus Rendah"
    );

    showBrowserNotification(
        "DripGuard Alert",
        "Infus Pasien Rendah"
    );

}

    
if(data.status === "LOW!!" && !alarmShown.LOW2){

    alarmShown.LOW2 = true;

    showNotification(
        "⚠ Infus Hampir Habis"
    );
    showBrowserNotification(
        "DripGuard Alert",
        "Infus Pasien Hampir Habis"
    );

}

if(data.status === "EMPTY" && !alarmShown.EMPTY){

    alarmShown.EMPTY = true;

    showNotification(
        "⚠ Infus Habis"
    );

    showBrowserNotification(
        "DripGuard Alert",
        "Infus Pasien Habis"
    );

}


if(data.status === "BLOCK" && !alarmShown.BLOCK){

    alarmShown.BLOCK = true;

    showNotification(
        "⚠ Infus Macet"
    );

    showBrowserNotification(
        "DripGuard Alert",
        "Aliran Infus Terhambat"
    );

}

if(data.status === "NORMAL"){

    alarmShown.LOW = false;
    alarmShown.LOW2 = false;
    alarmShown.EMPTY = false;
    alarmShown.BLOCK = false;
}
    
    // Grafik

    tpmData.push(data.tpm);
    setpointData.push(data.setpoint);
    labels.push("");

    if(tpmData.length > 20){

        tpmData.shift();
        setpointData.shift();
        labels.shift();

    }

    tpmChart.update();

}



// ============================
// LISTENER PASIEN
// ============================

function loadPasien(id){

    pasienAktif = id;

    document
    .getElementById("btn_pasien_01")
    .classList.remove("patient-active");

    document
    .getElementById("btn_pasien_02")
    .classList.remove("patient-active");

    document
    .getElementById("btn_pasien_03")
    .classList.remove("patient-active");

    document
    .getElementById("btn_" + id)
    .classList.add("patient-active");

    if(currentRef){
        off(currentRef);
    }

    tpmData.length = 0;
    setpointData.length = 0;
    labels.length = 0;

    tpmChart.update();

    currentRef = ref(db, pasienAktif);

    onValue(currentRef, (snapshot)=>{

        const data = snapshot.val();
        lastData = data;

        updateDashboard(data);

    });

}

// ============================
// GANTI PASIEN
// ============================

window.gantiPasien = function(id){

    loadPasien(id);

};


// ============================
// SETPOINT
// ============================

window.setTPM = function(nilai){

    const setpointRef =
        ref(db, pasienAktif + "/setpoint");

    onValue(setpointRef, (snapshot)=>{

        let current =
            snapshot.val();

        current += nilai;

        if(current < 0)
            current = 0;

        if(current > 60)
            current = 60;

        set(setpointRef,current);

    },{onlyOnce:true});

};


// ============================
// STARTUP
// ============================
setInterval(() => {

    if(lastData){
        updateDashboard(lastData);
    }

}, 1000);

/*
function updatePatientButtons(){
console.log("UPDATE BUTTON JALAN");
    for(let i=1;i<=3;i++){

        const id =
            "pasien_0" + i;

        const btn =
            document.getElementById(
                "btn_" + id
            );

        if(!btn) continue;

        const data =
            statusPasien[id];

        if(!data){
            btn.innerHTML =
                "⚪ Pasien " + i;
            continue;
        }

        const sekarang =
            Date.now()/1000;

        const selisih =
            sekarang - data.lastSeen;

        if(selisih < 20){

            btn.innerHTML =
                "🟢 Pasien " + i;

        }else{

            btn.innerHTML =
                "🔴 Pasien " + i;

        }

    }

}

["pasien_01","pasien_02","pasien_03"]
.forEach((id)=>{

    const pasienRef =
        ref(db,id);

    onValue(pasienRef,(snapshot)=>{

        statusPasien[id] =
            snapshot.val();

        updatePatientButtons();

    });

});
*/

function updateSummaryCards(){

    let online = 0;
    let offline = 0;
    let alarm = 0;

    for(const id in statusPasien){

        const data = statusPasien[id];

        if(!data) continue;

        const selisih =
            (Date.now()/1000) - data.lastSeen;

        if(selisih < 20){

            online++;

            if(data.persen <= 20){
                alarm++;
            }

        }else{

            offline++;

        }

    }

    document.getElementById("onlineCount").innerHTML =
        online;

    document.getElementById("offlineCount").innerHTML =
        offline;

    document.getElementById("alarmCount").innerHTML =
        alarm;

}

["pasien_01","pasien_02","pasien_03"]
.forEach((id)=>{

    const pasienRef =
        ref(db,id);

    onValue(pasienRef,(snapshot)=>{

        statusPasien[id] =
            snapshot.val();

        updateSummaryCards();

    });

});

const urlParams =
new URLSearchParams(window.location.search);

const pasienQR =
urlParams.get("pasien");

if(pasienQR){

    loadPasien(pasienQR);

}else{

    loadPasien("pasien_01");

}


if(pasienQR){

    document
    .querySelectorAll(".patient-selector button")
    .forEach(btn => {

        btn.classList.remove("active");

    });

    const btn =
    document.getElementById(
        "btn_" + pasienQR
    );

    if(btn){
        btn.classList.add("active");
    }

}

window.logout = function(){

    sessionStorage.removeItem("login");
    sessionStorage.removeItem("user");

    window.location.href = "index.html";

}

window.onload = function(){

    setTimeout(() => {

        showNotification(
            "TEST NOTIFIKASI DRIPGUARD"
        );

    }, 2000);

};

let audioUnlocked = false;

function unlockSound(){

    if(audioUnlocked) return;

    const audio =
        new Audio("assets/alarm.mp3");

    audio.volume = 0;

    audio.play();

    audioUnlocked = true;
}