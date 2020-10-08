module.exports = class Client {
  constructor({ socketId, name, roomName, playerNumber, host }) {
    this.socketId = socketId
    this.name = name
    this.roomName = roomName
    this.playerNumber = playerNumber
    this.host = !!host
  }

  getRoomName() {
    return this.roomName
  }

  [Symbol.iterator] = function* () {
    yield {
      socketId: this.socketId,
      socket: this.socket,
      name: this.name,
      roomName: this.roomName,
      playerNumber: this.playerNumber,
      host: this.host,
    }
  }
}
