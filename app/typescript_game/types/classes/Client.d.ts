import { IClient } from "./Interfaces";
export default class Client implements IClient {
    socketId: string;
    name: string;
    roomName: string;
    playerNumber: number;
    host: boolean;
    constructor({ socketId, name, roomName, playerNumber, host }: IClient);
    getRoomName(): string;
}
