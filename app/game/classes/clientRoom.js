const { SEQUENCE_LENGTH } = require("../constants")
const Lobby = require("./Lobby")
const { randomNumBetween } = require("../utils")

module.exports = class clientRoom extends Lobby {
  constructor() {
    super()
    this._emit = null
  }

  static createClientRoom(clients, emitter) {
    const room = new clientRoom()

    clients.forEach(client => room.addPlayer(client))
    room.setGameEmitter(emitter)

    return room
  }

  setGameEmitter(emit) {
    this._emit = emit
  }

  emit(eventName, data = null) {
    this._emit(eventName, data)
  }

  generateSequence() {
    const sequence = []
    for(let i = 0; i < SEQUENCE_LENGTH; i++) {
      sequence.push(Math.floor(randomNumBetween(0, SEQUENCE_LENGTH)))
    }
    return sequence
  }
}
