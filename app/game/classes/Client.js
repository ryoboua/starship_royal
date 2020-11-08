"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor({ socketId, name, roomName, playerNumber, host }) {
        this.socketId = socketId;
        this.name = name;
        this.roomName = roomName;
        this.playerNumber = playerNumber;
        this.host = !!host;
    }
    getRoomName() {
        return this.roomName;
    }
}
exports.default = Client;
