
var net = require('net')
var out = require('./out')
var stat = require('./stat')

module.exports = function main(listen, connect) {

  var nextId = 1
  var mainLog = logger('main')

  var server = net.createServer(function(a) {
    var id = nextId++
    var log = logger(id)
    var b = net.connect(connect[0], connect[1])
    a.pipe(stat.bytes('sent')).pipe(b)
    b.pipe(stat.bytes('received')).pipe(a)
    a.on('error', log.error('Socket error on A'))
    b.on('error', log.error('Socket error on B'))
    stat.sockets('incoming', a)
    stat.sockets('outgoing', b)
    log(socketAddress(a) + ' => ' + connect[1] + ':' + connect[0])
  })
  
  server.on('error', mainLog.error('Socket error on server'))
  
  server.listen(listen[0], listen[1], function() {
    var address = server.address()
    mainLog('Listening on ' + address.address + ':' + address.port)
    mainLog('Configured to connect to ' + connect[1] + ':' + connect[0])
  })

}

function logger(id) {
  var f = function(text) {
    out.line('[' + id + '] ' + text)
  }
  f.error = function(message) {
    return function(error) {
      f('!! ' + message + ': ' + error)
    }
  }
  return f
}

function socketAddress(socket) {
  return socket.remoteAddress + ':' + socket.remotePort
}
