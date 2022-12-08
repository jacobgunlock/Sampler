var RegionsPlugin = window.WaveSurfer.regions;
var CursorPlugin = window.WaveSurfer.cursor;
var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'green',
    progressColor: 'purple',
    backend: 'WebAudio',
    plugins: [
        RegionsPlugin.create({
            dragSelection: false,
            regionsMinLength: 0.5,
            maxRegions: 1,
            regions: []
        }),
        CursorPlugin.create({
            hideOnBlue: true,
        })
    ]
});

const audioContainer = document.querySelector(".audio-container-hidden")
const sampleScreen = document.querySelector(".sample-screen")
const loopbtn = document.querySelector(".loop-btn")
const playbtn = document.querySelector(".play-btn")
const stopbtn = document.querySelector(".stop-btn")
const mutebtn = document.querySelector(".mute-btn")
const minusbtn = document.querySelector(".minus-btn")
const plusbtn = document.querySelector(".plus-btn")
const waveform = document.getElementById("waveform")
const sample = document.getElementById("sample")
const edit = document.getElementById("edit")
const record = document.getElementById("record")
const stop = document.getElementById("stop_record")
let song;

playbtn.addEventListener("click", () => {
    wavesurfer.playPause();
    wavesurfer.params.scrollParent = false;

    if (wavesurfer.isPlaying()) {
        playbtn.classList.add("playing");
        wavesurfer.regions.list["loop"].play();
    } else {
        playbtn.classList.remove("playing");
    } 
});

document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {
        wavesurfer.playPause();
        wavesurfer.params.scrollParent = false;
    
        if (wavesurfer.isPlaying()) {
            playbtn.classList.add("playing");
            wavesurfer.regions.list["loop"].play();
        } else {
            playbtn.classList.remove("playing");
        }  
    }
  }

mutebtn.addEventListener("click", () => {
    if (wavesurfer.getMute() == false) {
        wavesurfer.setMute(true);
        mutebtn.classList.add("muted");
    } else {
        wavesurfer.setMute(false);
        mutebtn.classList.remove("muted");
    }
});

stopbtn.addEventListener("click", () => {
    wavesurfer.stop();
    playbtn.classList.remove("playing");
});

document.getElementById("still").addEventListener("click", () => {
    wavesurfer.addRegion({
        id: "loop",
        start: 1,
        end: 3,
        loop: true,
    });
    wavesurfer.loopSelection;
    wavesurfer.params.scrollParent = false;
    loopbtn.classList.add("looped");
});
    
document.getElementById("spin").addEventListener("click", () => {
    wavesurfer.clearRegions()
    loopbtn.classList.remove("looped");
});


document.querySelector('#zslider').oninput = function () {
    wavesurfer.zoom(Number(this.value));
    wavesurfer.params.scrollParent = false;
};


//Pitch
let value = parseInt(document.getElementById('number').value);
i = wavesurfer.getPlaybackRate();

plusbtn.addEventListener("click", () => {
    value = isNaN(value) ? 0 : value;
    if (value < 12) {
        value++;
        document.getElementById('number').value = value;
        i = i+(0.04166666666);
        wavesurfer.setPlaybackRate(i);
    } 
})

minusbtn.addEventListener("click", () => {
    value = isNaN(value) ? 0 : value;
    if (value > -12) {
        value--;
        document.getElementById('number').value = value;
        i = i-(0.04166666666);
        wavesurfer.setPlaybackRate(i);
    }
})

edit.addEventListener("click", () => {
    audioContainer.classList.add("audio-container");
    audioContainer.classList.remove("audio-container-hidden");
    sampleScreen.classList.add("sample-screen-hidden");
    sampleScreen.classList.remove("sample-screen");
    wavesurfer.load(song);
})

sample.addEventListener("click", () => {
    audioContainer.classList.add("audio-container-hidden");
    wavesurfer.stop();
    sampleScreen.classList.add("sample-screen");
    sampleScreen.classList.remove("sample-screen-hidden");
    playbtn.classList.remove("playing");
})


record.addEventListener("click", () => {
    captureTabAudio();
    record.style.backgroundColor = 'red';
})

stop.addEventListener("mousedown", () => {
    stop_record.style.backgroundColor = "blue";
})

stop.addEventListener("mouseup", () => {
    stop_record.style.backgroundColor = "lightskyblue";
})

function saveToFile(blob, name) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
}
function captureTabAudio() {
    chrome.tabCapture.capture({audio: true, video: false}, (stream) => {

        // these lines enable the audio to continue playing while capturing
        context = new AudioContext();
        var newStream = context.createMediaStreamSource(stream);
        newStream.connect(context.destination);

        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = (e) => {
            chunks.push(e.data);
        };
        recorder.onstop = (e) => saveToFile(new Blob(chunks), "test.wav");
        recorder.start();
        setTimeout(() => recorder.stop(), 5000);
    })
}