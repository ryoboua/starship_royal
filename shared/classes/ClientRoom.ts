import Lobby from "./Lobby"
import { randomNumBetween } from "../utils"
import { ClientModel, Emit } from "../interfaces"
import Mutations from "../mutations"
import { SEQUENCE_LENGTH } from "../../game/constants";

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

  emit(action: string, payload: any) {
    if (this._emit)
      this._emit(action, payload)
  }

  generateSequence() {
    const sequence = []
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      sequence.push(Math.floor(randomNumBetween(0, SEQUENCE_LENGTH)))
    }
    return sequence
  }
}
