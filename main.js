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
var value = parseInt(document.getElementById('number').value);
i = wavesurfer.getPlaybackRate();
function incrementValue()
{
    value = isNaN(value) ? 0 : value;
    if (value < 12) {
        value++;
        document.getElementById('number').value = value;
        i = i+(0.04166666666);
        wavesurfer.setPlaybackRate(i);
    } 
}

function decrementValue()
{
    value = isNaN(value) ? 0 : value;
    if (value > -12) {
        value--;
        document.getElementById('number').value = value;
        i = i-(0.04166666666);
        wavesurfer.setPlaybackRate(i);
    }
}

plusbtn.addEventListener("click", () => {
    incrementValue();
})

minusbtn.addEventListener("click", () => {
    decrementValue();
})

edit.addEventListener("click", () => {
    audioContainer.classList.add("audio-container");
    audioContainer.classList.remove("audio-container-hidden");
    sampleScreen.classList.add("sample-screen-hidden");
    sampleScreen.classList.remove("sample-screen");
})

sample.addEventListener("click", () => {
    audioContainer.classList.add("audio-container-hidden");
    wavesurfer.stop();
    sampleScreen.classList.add("sample-screen");
    sampleScreen.classList.remove("sample-screen-hidden");
    playbtn.classList.remove("playing");
})

if (navigator.mediaDevices.getUserMedia) {
    const constraints = { audio: true };
    let chunks = [];
    let onSuccess = function(stream) {
      const mediaRecorder = new MediaRecorder(stream);
  
      record.addEventListener("click", () => {
        mediaRecorder.start();
        record.style.background = "red";
        console.log("clicked");
      })
  
      stop.onclick = function() {
        mediaRecorder.stop();

      }
  
      mediaRecorder.onstop = function(e) {
        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
      }
      mediaRecorder.ondataavailable = function(e) {
        chunks.push(e.data);
      }
    }
    let onError = function(err) {}
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
}
    
stop.addEventListener("mousedown", () => {
    stop_record.style.backgroundColor = "blue";
})
    
stop.addEventListener("mouseup", () => {
    stop_record.style.backgroundColor = "lightskyblue";
})

function getLocalStream() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        window.localStream = stream; // A
        window.localAudio.srcObject = stream; // B
        window.localAudio.autoplay = true; // C
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
  }
    