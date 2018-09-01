const fs = require('fs')
const {AudioContext} = require('web-audio-api')
const context = new AudioContext
const websocket = require('websocket-stream')
const http = require('http')
const speaker = require('speaker')

const PORT = 9002
const server = http.createServer(function (req, res) {
  res.end('not found\n')
}).listen(PORT)

console.log(`Server Listening on ws://localhost:${PORT}`)

websocket.createServer({ server: server }, function (stream) {
  context.outStream = stream

  console.log('encoding format : ' 
  + context.format.numberOfChannels + ' channels ; '
  + context.format.bitDepth + ' bits ; '
  + context.sampleRate + ' Hz'
  )

  fs.readFile(__dirname + '/sounds/cello.wav',{ highWaterMark: 64 } ,function(err, buffer) {
    if (err) throw err
    context.decodeAudioData(buffer, function(audioBuffer) {
      let bufferNode = context.createBufferSource()
      bufferNode.connect(context.destination)
      bufferNode.buffer = audioBuffer
      bufferNode.loop = true
      bufferNode.start(0)
    })
  })

  fs.readFile(__dirname + '/sounds/drumLoop.wav',{ highWaterMark: 64 } ,function(err, buffer) {
    if (err) throw err
      context.decodeAudioData(buffer, function(audioBuffer) {
        let bufferNode = context.createBufferSource()
        bufferNode.connect(context.destination)
        bufferNode.buffer = audioBuffer
        bufferNode.loop = true
        bufferNode.start(0)
      })
  })

  fs.readFile(__dirname + '/sounds/cello.wav',{ highWaterMark: 64 } ,function(err, buffer) {
    if (err) throw err
      context.decodeAudioData(buffer, function(audioBuffer) {
        let bufferNode = context.createBufferSource()
        bufferNode.connect(context.destination)
        bufferNode.buffer = audioBuffer
        bufferNode.loop = true
        bufferNode.start(0)
      })
  })

})