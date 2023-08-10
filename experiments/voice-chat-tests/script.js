console.log("Hello World!!!")


const playBtn = document.getElementById("btn-play");
const pauseBtn = document.getElementById("btn-pause");
const downloadBtn = document.getElementById("btn-download");
const recordBtn = document.getElementById("dbtn-record");



const audioCtx = new window.AudioContext(); // Default destination is speakers
const analyzer = audioCtx.createAnalyser();
analyzer.minDecibels = -90;
analyzer.maxDecibels = -10;
analyzer.smoothingTimeConstant = 0.85;

// const oscillatorNode = new OscillatorNode(audioCtx);
// const gainNode = new GainNode(audioCtx);

// Add gainNode (controls volume) and finally the destination
// oscillatorNode.connect(gainNode).connect(audioCtx.destination);

//  Use setvalue at time for muting the value
// gainNode.gain.setValueAtTime(1, audioCtx.currentTime);


// oscillatorNode.start(); // Start can only be called once per oscillator node




console.log("Audio CTX: ", audioCtx);
// console.log("Audio Node: ", oscillatorNode);
// console.log("Gain Node: ", gainNode);


const createSampleAudioFreqData = () => {
    let data = [];

    let i = 0
    while (i++ < 1000) {
        data.push(Math.floor(20 + Math.random() * (20_000 - 20)))
    }

    // console.log(data);
    return data;
}

const freqData = createSampleAudioFreqData();


playBtn.addEventListener("click", (e) => {

    audioCtx.resume();
    // oscillatorNode.start(); // Start can only be called once per oscillator node
    // Unmute the oscillator
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);

    console.log(oscillatorNode);
    console.log("Play Clicked\n", audioCtx)


    const updateFreq = async () => {
        let startTime = audioCtx.currentTime;
        for (let i = 0; i < 100;) {
            const currentTime = audioCtx.currentTime;
            if (currentTime - startTime > 0.002) {
                oscillatorNode.frequency.setValueAtTime(freqData[i], audioCtx.currentTime)
                startTime = currentTime
                i++
            }

        }
    }
    // updateFreq() // This is blocking data




    const arr = new Uint8Array(analyzer.frequencyBinCount);
    // Analyzer analyses the audio graph
    // console.log(analyzer);
    analyzer.getByteFrequencyData(arr);
    console.log(arr);
    console.trace(); // outputs stack trace to the web console
    // async while (true) {
    //     console.log(audioCtx.currentTime);
    // }
})


pauseBtn.addEventListener("click", (e) => {
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    audioCtx.suspend();
    console.log("Pause Clicked", audioCtx)
})


downloadBtn.addEventListener("click", async (e) => {
    console.log("download clicked")

    audioCtx.resume();
    // Read response as arraybuffer
    const response = await fetch("https://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg")
    const audioData = await response.arrayBuffer()

    console.log(audioData)

    let source;

    audioCtx.decodeAudioData(
        await audioData, // Passing variable as await
        (buffer) => {
            console.log(buffer)

            // Create buffer source
            source = audioCtx.createBufferSource(); // create bsource node from buffer
            source.buffer = buffer // Add the buffer post processing

            // Connect to analyzer
            source.connect(analyzer) // Connect node
            analyzer.connect(audioCtx.destination)

            console.log(source)
            source.start(audioCtx.currentTime)

            // analyzer.fftSize = 256;
            const arr = new Uint8Array(analyzer.frequencyBinCount);

            // NOTE: For analyzer, wait for for sometime and run getData post that

            setTimeout(() => {
                analyzer.getByteTimeDomainData(arr)
                console.log(arr)
            }, 1000)


        }
    )
    // gainNode.gain.setValueAtTime(1, audioCtx.currentTime);

    console.log(source)

    // if (source) {
    //     console.log(source)
    //     source.start()
    // }


})
