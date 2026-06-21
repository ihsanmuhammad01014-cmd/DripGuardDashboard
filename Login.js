function login(){

    const user =
        document.getElementById("username").value.toLowerCase();

    const pass =
        document.getElementById("password").value;

    const akun = {

        "fakhrimuhammad"  : "081311538140",
        "ihsanmuhammad"  : "ihsan1104",
        "muhidin" : "410100599",
        "sarahchairulannisa"   : "410100723",
        "afhamramadhan"   : "410100731",
        "ariefgoeritno"   : "410100206",
        "jokiirawan"    : "410100403",
        "fithrimuliawati"  : "410100295",
        "opamustopa"     : "410200300",
        "maswan"  : "410105212",
        "suratun" : "410100191",
        "iwansumirat"    : "410100376",
        "agilmiraj"    : "410200203"
        

    };

    if(akun[user] === pass){

        const unlockAudio = new Audio(
            "assets/alarm.mp3"
        );

        unlockAudio.volume = 0;

        unlockAudio.play();

        sessionStorage.setItem(
            "login",
            "true"
        );

        sessionStorage.setItem(
            "user",
            user
        );

        

const redirectUrl =
    sessionStorage.getItem(
        "redirectAfterLogin"
    );

if(redirectUrl){

    sessionStorage.removeItem(
        "redirectAfterLogin"
    );

    window.location.href =
        redirectUrl;

}else{

    window.location.href =
        "Dashboard.html";

}

    }

    else{

        document.getElementById("error")
        .innerHTML =
        "Username atau Password salah";

    }

}

window.onload = function(){

    setTimeout(function(){

        document.getElementById(
            "loadingScreen"
        ).style.display = "none";

        document.getElementById(
            "mainContent"
        ).style.display = "flex";

    },2500);

}

    