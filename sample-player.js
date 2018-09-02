const fs = require('fs')
const createBuffer = require('audio-buffer-from')

const createAudioContext = require('./')
const through = require('through2')
const path = require('path')

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

/**
 * Midi Message Type
 */
createAudioContext((err, context, midi) => {
  // const buffers = createSampleBuffers(context, map)

  // setInterval(() => {
  //   context.decodeAudioData(map[80], function(audioBuffer) {
  //     const bufferNode = context.createBufferSource()
  //     bufferNode.connect(context.destination)
  //     bufferNode.buffer = audioBuffer
  //     bufferNode.start(0)
  //   })
  // }, 1000)

  midi.pipe(through((buf, enc, next) => {
    const midiBuffer = new Uint8Array(buf)
    context.decodeAudioData(map[80], function(audioBuffer) {
      let bufferNode = context.createBufferSource()
      bufferNode.connect(context.destination)
      bufferNode.buffer = audioBuffer
      bufferNode.loop = false
      bufferNode.start(0)
    })
    // const sample = buffers[midiBuffer[1]]
    // console.log(sample)
    // sample.node.start(0)
    next()
  }))
})
