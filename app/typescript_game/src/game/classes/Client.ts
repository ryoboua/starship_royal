import { IClient } from "./Interfaces"


export default class Client implements IClient {
  socketId
  name: string
  roomName: string
  playerNumber: number
  host: boolean

  constructor({ socketId, name, roomName, playerNumber, host }: IClient) {
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
