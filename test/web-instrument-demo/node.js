const fs = require('fs')
const {AudioContext} = require('web-audio-api')
const path = require('path')
const websocket = require('websocket-stream')
const http = require('http')
const Speaker = require('speaker')
const util = require('audio-buffer-utils')
const format = require('audio-format')
const createOscillator = require('audio-oscillator')
const through = require('through2')

const SOUND_FILE = path.join(__dirname, '../../sounds/powerpad.wav')
const PORT = 5000

const MODE = ['websocket', 'speaker'][0]

const context = new AudioContext

switch(MODE) {
  case 'websocket':
    runWebSocketStream()
    break;
  case 'speaker':
    runSpeaker()
    playSample()
    break;
}

function runSpeaker() {
  const speaker = new Speaker({
    channels: context.format.numberOfChannels,
    bitDepth: context.format.bitDepth,
    sampleRate: context.sampleRate
  })
  context.outStream = speaker
}

function runWebSocketStream() {
  const http = require('http')
  const ecstatic = require('ecstatic')
  
  var server = http.createServer(ecstatic(__dirname + '/public'))
  // var server = http.createServer()
  server.listen(PORT)
  
  console.log(`Server Listening on ws://localhost:${PORT}`)
  
  websocket.createServer({ server: server }, function (stream) {
    context.outStream = stream

    runSpeaker()

    stream.on('error', () => {
      console.log("connection closed")
    })

    console.log('encoding format : ' 
    + context.format.numberOfChannels + ' channels ; '
    + context.format.bitDepth + ' bits ; '
    + context.sampleRate + ' Hz'
    )  
  })
}

function playSample() {
  fs.readFile(SOUND_FILE, { highWaterMark: 512 } ,function(err, buffer) {
    if (err) throw err
    context.decodeAudioData(buffer, function(audioBuffer) {
      let bufferNode = context.createBufferSource()
      bufferNode.connect(context.destination)
      bufferNode.buffer = audioBuffer
      bufferNode.loop = true
      bufferNode.start(0)
    })
  })
}

function playFile() {
  // var myArrayBuffer = context.createBuffer(2, context.sampleRate * 3, context.sampleRate);

  // // Fill the buffer with white noise;
  // // just random values between -1.0 and 1.0
  // for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
  //   // This gives us the actual ArrayBuffer that contains the data
  //   var nowBuffering = myArrayBuffer.getChannelData(channel);
  //   for (var i = 0; i < myArrayBuffer.length; i++) {
  //     // Math.random() is in [0; 1.0]
  //     // audio needs to be in [-1.0; 1.0]
  //     nowBuffering[i] = Math.random() * 2 - 1;
  //   }
  // }

  // var source = context.createBufferSource();

  // let timbre = createOscillator({dtype: 'float32 44100', frequency: 11025})
  // let myArrayBuffer = timbre()
  // console.log(timbre)
  // source.buffer = myArrayBuffer;
  // source.loop = true
  // source.connect(context.destination)

  // source.start()

  // createOscillator({
  //   type: 'sine',
  //   format: 'float32 interleaved',
  //   channels: 4,
  //   sampleRate: 96000
  // })
  // createOscillator({
  //   type: 'sine',
  //   format: 'float32 interleaved',
  //   channels: 4,
  //   sampleRate: 96000
  // })
}