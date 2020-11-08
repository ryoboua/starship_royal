"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoundActive = exports.endRound = exports.startRound = exports.removePlayer = exports.addPlayer = exports.createRoom = void 0;
const ClientRoom_1 = __importDefault(require("../classes/ClientRoom"));
const appEvent_1 = require("../../appEvent");
const rooms = new Map();
function createRoom(roomName, players, emit) {
    rooms.set(roomName, ClientRoom_1.default.createClientRoom(players, emit));
}
exports.createRoom = createRoom;
function addPlayer(roomName, client, socket, resFn) {
    if (!rooms.has(roomName)) {
        return;
    }
    const room = rooms.get(roomName);
    room.addPlayer(client);
    const players = room.getPlayerList();
    resFn({ client, players });
    socket.to(roomName).broadcast.emit("ACTION", { mutation: appEvent_1.ADD_PLAYER, data: client });
}
exports.addPlayer = addPlayer;
function removePlayer(roomName, socketId) {
    if (!rooms.has(roomName)) {
        return;
    }
    const room = rooms.get(roomName);
    room.removePlayer(socketId);
    room.emit(appEvent_1.REMOVE_PLAYER, socketId);
}
exports.removePlayer = removePlayer;
function gameKeyDown(client, keyCode, socket) {
    const roomName = client.roomName;
    if (!rooms.has(roomName)) {
        return;
    }
}
function gameKeyUp(client, keyCode, socket) {
    const roomName = client.roomName;
    if (!rooms.has(roomName)) {
        return;
    }
}
function startRound(roomName) {
    if (!rooms.has(roomName)) {
        return;
    }
    const room = rooms.get(roomName);
    room.setRoundStatus(true);
    const sequence = room.generateSequence();
    room.emit(appEvent_1.START_ROUND, sequence);
}
exports.startRound = startRound;
function endRound(roomName) {
    if (!rooms.has(roomName)) {
        return;
    }
    const room = rooms.get(roomName);
    room.setRoundStatus(false);
}
exports.endRound = endRound;
function isRoundActive(roomName) {
    if (!rooms.has(roomName)) {
        return;
    }
    return rooms.get(roomName).isRoundActive();
}
exports.isRoundActive = isRoundActive;
