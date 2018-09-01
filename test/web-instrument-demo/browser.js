const { Readable, Writable } = require('web-audio-stream/stream')
const AudioContext = require('audio-context')
const wsock = require('websocket-stream')
const to = require('to2')
const AudioBufferStream = require('audio-buffer-stream')

const audioBufferStream = AudioBufferStream({
  bitDepths: 16,
  channels: 2,
  chunkLength: 512
})

const OFFLINE = true

const HOST = {
  sampleRate: 44100,
  channels: 2,
  length: 44100 * 40
}

let stream = wsock('ws://localhost:5000')

const context = new AudioContext({
  offline: OFFLINE,
  ...HOST
})

let oscillator = context.createOscillator()
oscillator.type = 'sawtooth'
oscillator.frequency.value = 60
oscillator.start()

let down = false
setInterval(() => {
  if (oscillator.frequency.value > 60) down = true
  if (oscillator.frequency.value < 60) down = false

  if (down) oscillator.frequency.value -= 30
  else oscillator.frequency.value += 30
}, 220)

oscillator.connect(context.destination)

Readable(oscillator).pipe(audioBufferStream)
audioBufferStream.pipe(stream)

context.startRendering()

