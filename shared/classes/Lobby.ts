import { ClientModel, Players } from "../interfaces"
import Player from "../../game/classes/Player"

export default class Lobby {
    players: Players
    roundActive: boolean
    constructor() {
        this.players = {}
        this.roundActive = false
    }

    get playerList(): Player[] {
        return Object.values(this.players)
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

    setRoundStatus(b: boolean) {
        this.roundActive = b
    }
}