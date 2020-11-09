import Lobby from "./Lobby"
import { randomNumBetween } from "../utils"
import { ClientModel, Emit } from "../../interfaces"
import Mutations from "../../mutations"

const { SEQUENCE_LENGTH } = require("../constants")

export default class clientRoom extends Lobby {
  private _emit: Emit | null
  constructor() {
    super()
    this._emit = null
  }

  static createClientRoom(clients: ClientModel[], emit: Emit) {
    const room = new clientRoom()

    clients.forEach(client => room.addPlayer(client))
    room.setGameEmitter(emit)

    return room
  }

  setGameEmitter(emit: Emit) {
    this._emit = emit
  }

  emit(mutation: Mutations, data = null) {
    if (this._emit)
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
