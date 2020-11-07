"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = __importDefault(require("./Player"));
class Lobby {
    constructor() {
        this.players = {};
        this.roundActive = false;
    }
    addPlayer(client) {
        if (Object.keys(this.players).some(socketId => socketId === client.socketId)) {
            return;
        }
        const player = new Player_1.default(client);
        this.players[player.socketId] = player;
    }
    removePlayer(socketId) {
        delete this.players[socketId];
    }
    getPlayerList() {
        return Object.values(this.players);
    }
    setRoundStatus(b) {
        this.roundActive = b;
    }
    isRoundActive() {
        return this.roundActive;
    }
}
exports.default = Lobby;
