"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lobby_1 = __importDefault(require("./Lobby"));
const utils_1 = require("../utils");
const { SEQUENCE_LENGTH } = require("../constants");
class clientRoom extends Lobby_1.default {
    constructor() {
        super();
        this._emit = null;
    }
    static createClientRoom(clients, emitter) {
        const room = new clientRoom();
        clients.forEach(client => room.addPlayer(client));
        room.setGameEmitter(emitter);
        return room;
    }
    setGameEmitter(emit) {
        this._emit = emit;
    }
    emit(mutation, data = null) {
        this._emit({ mutation, data });
    }
    generateSequence() {
        const sequence = [];
        for (let i = 0; i < SEQUENCE_LENGTH; i++) {
            sequence.push(Math.floor(utils_1.randomNumBetween(0, SEQUENCE_LENGTH)));
        }
        return sequence;
    }
}
exports.default = clientRoom;
