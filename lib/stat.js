
var sprintf = require('sprintf').sprintf
var out = require('./out')
var stat = { sent: 0, received: 0, incoming: 0, outgoing: 0 }
var through = require('through')

module.exports = stat

stat.update = (function() {
  var check = function() {
    var state = 0
    return function(value, callback) {
      for (; state < value; state ++) {
        callback()
      }
    }
  }
  var sent = check()
  var received = check()
  var inc = (function() {
    var count = 0
    return function() {
      count += 1
      if (count >= 80) {
        count -= 80
        out.line(sprintf('Sent %.2f MB, received %.2f MB', stat.sent / 1048576, stat.received / 1048576))
      }
    }
  })()
  return function() {
    sent(stat.sent / (1024 * 1024 / 80),     function() { out.print('^'); inc() })
    received(stat.received / (1024 * 1024 / 80), function() { out.print('v'); inc() })
  }
})()

stat.bytes = function(name) {
  return through(function(data) {
    stat[name] += data.length
    stat.update()
    this.queue(data)
  })
}

stat.sockets = function(name, sock) {
  stat[name] += 1
  sock.on('close', function() {
    stat[name] -= 1
  })
}

