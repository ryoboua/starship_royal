module.exports = class Client {
    constructor(socketId, name, roomName, host=false) {
        this.socketId = socketId
        this.name = name
        this.roomName = roomName
        this.host = host
    }

    getRoomName() {
        return this.roomName
    }
}