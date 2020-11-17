import { ClientModel } from "../../shared/interfaces"

export default class Client implements ClientModel {
  socketId: string
  name: string
  roomName: string
  playerNumber: number
  host: boolean
  color: string

  constructor({ socketId, name, roomName, playerNumber, host, color }: ClientModel) {
    this.socketId = socketId
    this.name = name
    this.roomName = roomName
    this.playerNumber = playerNumber
    this.host = !!host
    this.color = color
  }
}
