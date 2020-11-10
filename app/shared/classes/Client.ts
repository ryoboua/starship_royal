import { ClientModel } from "../../shared/interfaces"

export default class Client implements ClientModel {
  socketId: string
  name: string
  roomName: string
  playerNumber: number
  host: boolean

  constructor({ socketId, name, roomName, playerNumber, host }: ClientModel) {
    this.socketId = socketId
    this.name = name
    this.roomName = roomName
    this.playerNumber = playerNumber
    this.host = !!host
  }
}
