const fs = require('fs')
const createBuffer = require('audio-buffer-from')

const createAudioContext = require('./')
const through = require('through2')
const path = require('path')
const player = require('./sample-player-lib')

const loopFile = (path, context) => {
  fs.readFile(path, function(err, buffer) {
    if (err) throw err
    context.decodeAudioData(buffer, function(audioBuffer) {
      let bufferNode = context.createBufferSource()
      bufferNode.connect(context.destination)
      bufferNode.buffer = audioBuffer
      bufferNode.start(0)
      bufferNode.stop()
    })
  })
}

const createSampleBuffers = (context, map) => {
  let buffers = {} 
 
  for(let i in map) {
    context.decodeAudioData(map[i], function(audioBuffer) {
      let bufferNode = context.createBufferSource()
      bufferNode.connect(context.destination)
      bufferNode.buffer = audioBuffer
      buffers[i] = {}
      buffers[i].node = bufferNode
      // bufferNode.start(0)
    })
  }

  return buffers
}

const map = {
  '79': fs.readFileSync(path.join(__dirname + '/sounds/drumLoop.wav')),
  '80': fs.readFileSync(path.join(__dirname + '/sounds/cello.wav')),
  '81': fs.readFileSync(path.join(__dirname + '/sounds/powerpad-mono.wav'))
}

const maps = context => ({
  'kick': createBuffer(fs.readFileSync(path.join(__dirname + '/sounds/drumLoop.wav'), {context})),
  'snare': createBuffer(fs.readFileSync(path.join(__dirname + '/sounds/cello.wav'), {context})),
  'hihat': createBuffer(fs.readFileSync(path.join(__dirname + '/sounds/powerpad-mono.wav'), {context}))
})

const playSample = context => node => {
  context.decodeAudioData(map[node], function(audioBuffer) {
    console.log(node, context.currentTime)
    let bufferNode = context.createBufferSource()
    bufferNode.connect(context.destination)
    bufferNode.buffer = audioBuffer
    bufferNode.start(context.currentTime + 1)
  })
}
/**
 * Midi Message Type
 */
createAudioContext((err, context, midi) => {
  const play = playSample(context)
  midi.pipe(through((buf, enc, next) => {
    const midiBuffer = new Uint8Array(buf)
    play(midiBuffer[1])
    next()
  }))
})
