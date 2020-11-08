"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeadPlayer = exports.handleEndRound = exports.handleStartRound = exports.handleKeyUp = exports.handleKeyDown = exports.handleDisconnect = exports.joinRoom = exports.handleNewGame = void 0;
const Client_1 = __importDefault(require("../../game/classes/Client"));
const clientRoomController_1 = require("../../game/controllers/clientRoomController");
const utils_1 = require("../utils");
const appEvent_1 = require("../../appEvent");
const clientList = new Map();
function handleNewGame(socket, name, initGameEmitter, resFn) {
    const roomName = utils_1.makeid(5);
    socket.join(roomName, (err) => {
        if (err) {
            return;
        }
        const playerNumber = 1;
        const client = new Client_1.default({
            socketId: socket.id,
            name,
            roomName,
            playerNumber,
            host: true,
        });
        clientList.set(client.socketId, client);
        clientRoomController_1.createRoom(roomName, [client], initGameEmitter(roomName));
        resFn(client);
    });
}
exports.handleNewGame = handleNewGame;
function joinRoom(socket, roomName, name, numClients, resFn) {
    if (clientRoomController_1.isRoundActive(roomName)) {
        const err = {
            header: `Unable to join while round active`,
        };
        return resFn(null, err);
    }
    socket.join(roomName, (err) => {
        if (err) {
            return resFn(null, {
                header: `Error trying to join room ${roomName}`,
                body: err
            });
        }
        const playerNumber = numClients + 1;
        const client = new Client_1.default({
            socketId: socket.id,
            name,
            roomName,
            playerNumber,
            host: false
        });
        clientList.set(client.socketId, client);
        clientRoomController_1.addPlayer(roomName, client, socket, resFn);
    });
}
exports.joinRoom = joinRoom;
function handleDisconnect(socket) {
    if (!clientList.has(socket.id)) {
        return;
    }
    const roomName = clientList.get(socket.id).getRoomName();
    clientRoomController_1.removePlayer(roomName, socket.id);
    clientList.delete(socket.id);
}
exports.handleDisconnect = handleDisconnect;
function handleKeyDown(socket, keyCode) {
    if (!clientList.has(socket.id)) {
        return;
    }
    const roomName = clientList.get(socket.id).getRoomName();
    if (!clientRoomController_1.isRoundActive(roomName)) {
        return;
    }
    socket.to(roomName).broadcast.emit("ACTION", { mutation: appEvent_1.KEY_DOWN, data: { keyCode, socketId: socket.id } });
}
exports.handleKeyDown = handleKeyDown;
function handleKeyUp(socket, keyCode) {
    if (!clientList.has(socket.id)) {
        return;
    }
    const roomName = clientList.get(socket.id).getRoomName();
    if (!clientRoomController_1.isRoundActive(roomName)) {
        return;
    }
    socket.to(roomName).broadcast.emit("ACTION", { mutation: appEvent_1.KEY_UP, data: { keyCode, socketId: socket.id } });
}
exports.handleKeyUp = handleKeyUp;
function handleStartRound(socket) {
    if (!clientList.has(socket.id)) {
        return;
    }
    const client = clientList.get(socket.id);
    if (!client.host) {
        return;
    }
    const roomName = client.getRoomName();
    clientRoomController_1.startRound(roomName);
}
exports.handleStartRound = handleStartRound;
function handleEndRound(socket) {
    if (!clientList.has(socket.id)) {
        return;
    }
    const client = clientList.get(socket.id);
    if (!client.host) {
        return;
    }
    const roomName = client.getRoomName();
    clientRoomController_1.endRound(roomName);
}
exports.handleEndRound = handleEndRound;
function handleDeadPlayer(socket, deadPlayerSocketId) {
    if (!clientList.has(socket.id)) {
        return;
    }
    const roomName = clientList.get(socket.id).getRoomName();
    if (!clientRoomController_1.isRoundActive(roomName)) {
        return;
    }
    socket.to(roomName).broadcast.emit("ACTION", { mutation: appEvent_1.PLAYER_DEAD, data: deadPlayerSocketId });
}
exports.handleDeadPlayer = handleDeadPlayer;
