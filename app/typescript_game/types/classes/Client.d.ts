export default class Client {
    constructor({ socketId, name, roomName, playerNumber, host }: {
        socketId: any;
        name: any;
        roomName: any;
        playerNumber: any;
        host: any;
    });
    socketId: any;
    name: any;
    roomName: any;
    playerNumber: any;
    host: boolean;
    getRoomName(): any;
}
