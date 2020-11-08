"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const clientController_js_1 = require("./controllers/clientController.js");
const appEvent_1 = require("../appEvent");
const io = socket_io_1.default();
io.serveClient(false);
io.listen(3000);
function initGameEmitter(roomName) {
    return (commit) => io.sockets.in(roomName).emit("ACTION", commit);
}
io.on("connection", (socket) => {
    socket.on(appEvent_1.CREATE_GAME, (name, resFn) => clientController_js_1.handleNewGame(socket, name, initGameEmitter, resFn));
    socket.on(appEvent_1.JOIN_GAME, handleJoinRoom);
    socket.on(appEvent_1.START_ROUND, () => clientController_js_1.handleStartRound(socket));
    socket.on(appEvent_1.END_ROUND, () => clientController_js_1.handleEndRound(socket));
    socket.on(appEvent_1.DISCONNECT, () => clientController_js_1.handleDisconnect(socket));
    socket.on(appEvent_1.KEY_DOWN, (keyCode) => clientController_js_1.handleKeyDown(socket, keyCode));
    socket.on(appEvent_1.KEY_UP, (keyCode) => clientController_js_1.handleKeyUp(socket, keyCode));
    socket.on(appEvent_1.PLAYER_DEAD, (deadPlayerSocketId) => clientController_js_1.handleDeadPlayer(socket, deadPlayerSocketId));
    function handleJoinRoom({ roomName, name }, resFn) {
        const room = io.sockets.adapter.rooms[roomName];
        let allUsers;
        if (room) {
            allUsers = room.sockets;
        }
        let numClients = 0;
        if (allUsers) {
            numClients = Object.keys(allUsers).length;
        }
        if (numClients === 0) {
            const err = {
                header: "Unknown Room",
                body: `Unable to find room ${roomName}`,
            };
            return resFn(null, err);
        }
        else if (numClients >= 4) {
            const err = {
                header: `Room is full`,
                body: `Room ${roomName} is full. Maximum of 4 players per room`,
            };
            return resFn(null, err);
        }
        clientController_js_1.joinRoom(socket, roomName, name, numClients, resFn);
    }
});
