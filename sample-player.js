module.exports = (context, map) => node => {
  context.decodeAudioData(map[node], function(audioBuffer) {
    console.log(node, context.currentTime)
    let bufferNode = context.createBufferSource()
    bufferNode.connect(context.destination)
    bufferNode.buffer = audioBuffer
    bufferNode.start(context.currentTime + 1)
  })
}