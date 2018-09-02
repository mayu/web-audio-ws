const fs = require('fs')
const http = require('http')
const path = require('path')
const websocket = require('websocket-stream')
const util = require('audio-buffer-utils')
const format = require('audio-format')
const {AudioContext} = require('web-audio-api')
const through = require('through2')

const PORT = 5000
const isDebug = true

const Speaker = require('speaker')

function runSpeaker(context, callback) {
  const speaker = new Speaker({
    channels: context.format.numberOfChannels,
    bitDepth: context.format.bitDepth,
    sampleRate: context.sampleRate
  })
  context.outStream = speaker
  callback(null, context)
}

function runServer(context, callback) {
  const server = http.createServer()
  server.listen(PORT)

  console.log(`Server Listening on ws://localhost:${PORT}`)
  
  websocket.createServer({ server: server }, function (stream) {
    context.outStream = stream

    // const midiStream = stream.pipe(through((buf, enc, next) => {
    //   const midiBuffer = new Uint8Array(buf)
    //   console.log("MMM", midiBuffer)
    //   next()
    // }))
   
    callback(null, context, stream)

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

function createAudioContext(callback) {
  let err = null;
  const context = new AudioContext
  if(isDebug) runSpeaker(context, callback)
  else runServer(context, callback)
}

module.exports = createAudioContext
