import { ClientModel } from "../../interfaces"


export default class Client implements ClientModel {
  socketId
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

  getRoomName() {
    return this.roomName
  }

}
