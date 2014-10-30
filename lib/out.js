
var out = {
  line: function() {
    if (this.nl) process.stderr.write('\n')
    this.nl = false
    console.error.apply(console, arguments)
  },
  print: function(str) {
    process.stderr.write(str)
    this.nl = true
  }
}

module.exports = out
