console.log("Hello World!!!")


// Create a wave with a given frequency


// Webkit audit context is old one 

const playBtn = document.getElementById("")


const audioCtx = new window.AudioContext();
const oscillator = audioCtx.createOscillator();


oscillator.type = "square";
oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);

// Connect oscillator to destination node

oscillator.connect(audioCtx.destination);
audioCtx.resume();
oscillator.start();

// audioEle.play()
// audioEle.pause();


setTimeout(() => {
    audioCtx.close();
}, 1000 * 1)


// console.log(audioEle)
