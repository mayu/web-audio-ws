const fs = require('fs')
const {AudioContext} = require('web-audio-api')
const context = new AudioContext
const Speaker = require('speaker')
const websocket = require('websocket-stream')
const http = require('http')


const server = http.createServer(function (req, res) {
  res.end('not found\n')
}).listen(5000)

console.log('Server Listening on ws://localhost:5000')

websocket.createServer({ server: server }, function (stream) {
  context.outStream = stream

  console.log('encoding format : ' 
  + context.format.numberOfChannels + ' channels ; '
  + context.format.bitDepth + ' bits ; '
  + context.sampleRate + ' Hz'
  )

  fs.readFile(__dirname + '/sounds/powerpad.wav', function(err, buffer) {
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