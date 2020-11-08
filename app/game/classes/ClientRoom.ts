import Lobby from "./Lobby"
import { randomNumBetween } from "../utils"
import { ClientModel } from "../../interfaces"

const { SEQUENCE_LENGTH } = require("../constants")

export default class clientRoom extends Lobby {
  constructor() {
    super()
    this._emit = null
  }

  static createClientRoom(clients: Array<ClientModel>, emitter) {
    const room = new clientRoom()

    clients.forEach(client => room.addPlayer(client))
    room.setGameEmitter(emitter)

    return room
  }

  setGameEmitter(emit) {
    this._emit = emit
  }

  emit(mutation, data = null) {
    this._emit({ mutation, data })
  }

  generateSequence() {
    const sequence = []
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      sequence.push(Math.floor(randomNumBetween(0, SEQUENCE_LENGTH)))
    }
    return sequence
  }
}
