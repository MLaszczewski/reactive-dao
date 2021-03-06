const Connection = require("./ReactiveConnection.js")

class LoopbackConnection extends Connection {
  constructor(sessionId, server, settings) {
    super(sessionId, settings)
    this.server = server
    this.delay = settings.delay || 0
    this.serverMessageListener = null
    this.serverCloseListener = null
    this.headers = {}
    this.initialize()
  }

  initialize() {
    setTimeout(() => {
      this.server.handleConnection(this)
      this.handleConnect()
    }, this.delay)
  }

  send(message) {
    var data = JSON.stringify(message)
    console.info("CLIENT => SERVER Message", message)
    setTimeout(() => {
      this.serverMessageListener(data)
    }, this.delay)
  }

  reconnect() {
    this.handleDisconnect()
    this.serverCloseListener()
    if (this.autoReconnect) return;
    this.initialize()
  }

  dispose() {
    this.finished = true
    this.handleDisconnect()
    this.serverCloseListener()
  }

  write(json) {
    var message = JSON.parse(json)
    console.info("SERVER => CLIENT Message", message)
    setTimeout(() => {
        this.handleMessage(message)
    }, this.delay)
  }

  on(what, listener) {
    if(what == 'data') this.serverMessageListener = listener
    if(what == 'close') this.serverCloseListener = listener
  }

}

module.exports = LoopbackConnection