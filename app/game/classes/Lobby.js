const Player = require("./Player")
module.exports = class Lobby {
    constructor() {
        this.players = {}
        this.roundActive = false
    }

    addPlayer(client) {
        if (Object.values(this.players).some(player => player.socketId === client.socketId)) {
          return
        }
        const player = new Player(client)
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