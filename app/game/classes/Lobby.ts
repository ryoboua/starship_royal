import { ClientModel, PlayerModel, Players } from "../../interfaces"
import Player from "./Player"

export default class Lobby {
    players: Players
    roundActive: boolean
    constructor() {
        this.players = {}
        this.roundActive = false
    }

    addPlayer(client: ClientModel) {
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