const START_TIME = 5 * 1000 * 60;

let running = false;
let remaining_time = START_TIME;
let timer;


let bgm = document.getElementById("bgm");
let alarm = document.getElementById("alarm");

//play bgm
function play_music(){
    bgm.play()
    .then(() => console.log("Music playing..."))
    .catch(error => console.error("Error playing music:", error));
}

//pause bgm
function pause_music(){
    bgm.pause();
}

//stop alarm
function stopAlarm() {
    alarm.pause();
    alarm.currentTime = 0;

    window.location.href = "timer.html";
}

//play alarm
function play_alarm(){
    alarm.currentTime = 0;
    alarm.playbackRate = 2.3;

    alarm.play()
        .then(() => {
            console.log("Alarm playing...");
            document.addEventListener("click", stopAlarm, { once: true });
        })
        .catch(error => console.error("Error playing alarm:", error));
        //declared before call because js reads code line-by-line.
}


function update(){
    let minutes = Math.floor(remaining_time / (1000 * 60) %60);
    let seconds = Math.floor(remaining_time / 1000 %60);

    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    document.getElementById('time').innerText = `${minutes}:${seconds}`;
}

document.getElementById('start').onclick = function start(){
    if(!running){
        play_music();
        running = true;
        timer = setInterval(function(){
            if(remaining_time > 0){
                remaining_time -= 1000;
                update();
            }else{
                clearInterval(timer);
                remaining_time = 0;
                running = false;
                if (typeof pause_music === "function") pause_music();   //This prevents errors if pause_music is undefined.
                play_alarm();
                update();
            }   
        }, 1000);
    }
};

document.getElementById('pause').onclick = function pause(){
    clearInterval(timer);
    running = false;
    pause_music();
};

document.getElementById('reset').onclick = function reset(){
    clearInterval(timer);
    remaining_time = START_TIME;
    running = false;
    pause_music();
    update();
};


document.getElementById("increase").addEventListener("click", function () {
    remaining_time += 60*1000;
    update();
});

document.getElementById("decrease").addEventListener("click", function () {
    if (remaining_time > 60*1000) {
        remaining_time -= 60*1000;
    }
    update();
});

document.getElementById("muteCheck").onchange = function toggle_mute() {
    bgm.muted = !bgm.muted;
};

//chnage music with dropdown
document.getElementById("audioList").addEventListener("change", function(){
    let selectedValue = this.value;
    if (selectedValue) {
        bgm.src = selectedValue; // Change the src attribute
        bgm.load(); //reload src
        if(running){
            bgm.play();
        }
    } else {
        bgm.src = "./audio/lofi-alarm-clock.mp3"; // Reset to default if no selection
    }
});

//update(); // initiallize display on page loadS