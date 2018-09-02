const http = require('http')
const websocket = require('websocket-stream')
const debounce = require('debounce-stream')
const map = require('through2-map')
const {AudioContext} = require('web-audio-api')
const Speaker = require('speaker')

const opts = {
  port: 9002,
  debug: true
}

function createAudioContext(callback) {

  const context = new AudioContext

  const server = http.createServer()
  server.listen(opts.port)

  console.log(`Server Listening on ws://localhost:${opts.port}`)
  
  websocket.createServer({ server: server }, function (stream) {

    if(opts.debug) {
      context.outStream = new Speaker({
        channels: context.format.numberOfChannels,
        bitDepth: context.format.bitDepth,
        sampleRate: context.sampleRate
      })  
    } else {
      context.outStream = stream
    }

    const midiMessagesStream = stream
      .pipe(debounce(10))
      .pipe(map(buf => new Uint8Array(buf)))
    
    callback(null, context, midiMessagesStream)

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

module.exports = createAudioContext
