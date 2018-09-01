const fs = require('fs')
const createAudioContext = require('./')
const to = require('to2')
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

const map = {
  37: fs.readFileSync(path.join(__dirname + '/sounds/drumLoop.wav')),
  38: fs.readFileSync(path.join(__dirname + '/sounds/cello.wav')),
  39: fs.readFileSync(path.join(__dirname + '/sounds/powerpad-mono.wav'))
}

const triggerSamples = context => (note, velocity) => {
  context.decodeAudioData(map[note], function(audioBuffer) {
    let bufferNode = context.createBufferSource()
    bufferNode.connect(context.destination)
    bufferNode.buffer = audioBuffer
    bufferNode.start(0)
  })
}

/**
 * Midi Message Type
 * type NoteOnOff = 0 | 1
 * type MIDI_MESSAGE_BUFFER = [NoteOnOff]
 */
createAudioContext((err, context, midi) => {
  const trigger = triggerSamples(context)
  midi.pipe(to(buf, enc, next) => {
    trigger(37, 120)
  })
})
