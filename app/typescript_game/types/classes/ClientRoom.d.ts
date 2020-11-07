import Lobby from "./Lobby";
import { IClient } from "./Interfaces";
export default class clientRoom extends Lobby {
    constructor();
    static createClientRoom(clients: Array<IClient>, emitter: any): clientRoom;
    setGameEmitter(emit: any): void;
    emit(mutation: any, data?: null): void;
    generateSequence(): number[];
}
