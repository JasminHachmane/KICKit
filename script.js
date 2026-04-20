function startGame(){
    window.location.href = "mascotte.html";
}

function selectMascot(m){
    localStorage.setItem('mascot', m);
    window.location.href = "customize.html";
}

function savePlayer(){
    localStorage.setItem('name', document.getElementById('name').value);
    localStorage.setItem('number', document.getElementById('number').value);
    window.location.href = "spel.html";
}

if(document.getElementById('ball')){
    document.getElementById('ball').addEventListener('click', shoot);
}

function shoot(){
    let success = Math.random() > 0.5;
    if(success){
        document.getElementById('feedback').innerText = "GOAL!!! 🎉";
        setTimeout(()=> window.location.href="resultaat.html",1500);
    } else {
        document.getElementById('feedback').innerText = "Bijna! 😄";
    }
}

if(document.getElementById('result')){
    let name = localStorage.getItem('name');
    let number = localStorage.getItem('number');
    document.getElementById('result').innerText = name + " - #" + number;
}

function restart(){
    window.location.href = "startscherm.html";
}
