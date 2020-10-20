module.exports = class Room {
    constructor() {
        this.clients = []
        this._emit = null
        this.roundActive = false
    }

    static createRoom(client, emitter) {
        const room = new Room()

        room.addClient(client)
        room.setRoomEmitter(emitter)

        return room
    }

    setRoomEmitter(emit) {
        this._emit = emit
    }

    emit(eventName, data = null) {
        this._emit(eventName, data)
    }

    addClient(client) {
        this.clients[client.socketId] = client
    }

    removeClient(socketId) {
        delete this.clients[socketId]
    }

    getClientList() {
        return Object.values(this.clients)
    }

    setRoundStatus(b) {
        this.roundActive = b
      }
    
      isRoundActive() {
        return this.roundActive
      }
}