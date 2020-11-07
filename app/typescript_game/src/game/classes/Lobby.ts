import { IClient } from "./Interfaces"
import Player from "./Player"

export default class Lobby {
    players: { [socketId: string]: Player }
    roundActive: boolean
    constructor() {
        this.players = {}
        this.roundActive = false
    }

    addPlayer(client: IClient) {
        if (Object.keys(this.players).some(socketId => socketId === client.socketId)) {
            return
        }
        const player = new Player(client)
        this.players[player.socketId] = player
    }

    removePlayer(socketId: string) {
        delete this.players[socketId]
    }

    getPlayerList(): Array<Player> {
        return Object.values(this.players)
    }


    setRoundStatus(b: boolean) {
        this.roundActive = b
    }

    isRoundActive(): boolean {
        return this.roundActive
    }
}