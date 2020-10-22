const Player = require("./Player")
module.exports = class Lobby {
    constructor() {
        this.players = {}
        this.roundActive = false
    }

    addPlayer(player) {
        if (Object.values(this.players).some(p => p.socketId === player.socketId)) {
            return
        }
        player = new Player(player)
        this.players[player.socketId] = player
    }

    removePlayer(socketId) {
        delete this.players[socketId]
    }

    getPlayerList() {
        return Object.values(this.players)
    }


    setRoundStatus(b) {
        this.roundActive = b
    }

    isRoundActive() {
        return this.roundActive
    }
}