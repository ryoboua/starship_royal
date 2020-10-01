module.exports = class Client {
    constructor(socketId, name, roomName) {
        this.socketId = socketId
        this.name = name
        this.roomName = roomName
    }

    getRoomName() {
        return this.roomName
    }
}