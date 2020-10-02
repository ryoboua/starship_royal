module.exports = class Client {
  constructor(socketId, name, roomName, playerNumber, host=false) {
    this.socketId = socketId
    this.name = name
    this.roomName = roomName
    this.playerNumber = playerNumber
    this.host = host
  }

  getRoomName() {
    return this.roomName
  }
}
