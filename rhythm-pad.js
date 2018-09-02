const fs = require('fs')
const path = require('path')
const to = require('to2')

const createSamplePlayer = require('./sample-player')
const createAudioContext = require('./')

const soundBank = {
  '79': fs.readFileSync(path.join(__dirname + '/sounds/drumLoop.wav')),
  '80': fs.readFileSync(path.join(__dirname + '/sounds/cello.wav')),
  '81': fs.readFileSync(path.join(__dirname + '/sounds/powerpad-mono.wav'))
}

createAudioContext((err, context, midiStream) => {
  if(err) throw new Error('error creating web instrument server')
  const play = createSamplePlayer(context, soundBank)
  play(79)
  setTimeout(() => {
    play(79)
  },3000)
  midiStream
    .pipe(to((midi, enc, next) => {
      play(79)
      next()
    }))

})


