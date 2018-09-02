const fs = require('fs')
const player = require('sample-player')
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

const createSampleBuffers = (context) => ({
  '79': createBuffer(fs.readFileSync(path.join(__dirname + '/sounds/drumLoop.wav')), { context }),
  '80': createBuffer(fs.readFileSync(path.join(__dirname + '/sounds/cello.wav')), { context }),
  '81': createBuffer(fs.readFileSync(path.join(__dirname + '/sounds/powerpad-mono.wav')), { context })
})
const triggerSamples = context => (note, velocity) => {
  context.decodeAudioData(map[note], function(audioBuffer) {
    let bufferNode = context.createBufferSource()
    bufferNode.connect(context.destination)
    bufferNode.buffer = audioBuffer
    console.log(bufferNode)
    bufferNode.start(0)
  })
}

/**
 * Midi Message Type
 * type NoteOnOff = 0 | 1
 * type MIDI_MESSAGE_BUFFER = [NoteOnOff]
 */
createAudioContext((err, context, midi) => {
  const buffers = createSampleBuffers(context)
  midi.pipe(through((buf, enc, next) => {
    const midiBuffer = new Uint8Array(buf)
    next()
  }))
})
