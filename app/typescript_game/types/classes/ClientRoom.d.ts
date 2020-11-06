export default class clientRoom extends Lobby {
    static createClientRoom(clients: any, emitter: any): clientRoom;
    _emit: any;
    setGameEmitter(emit: any): void;
    emit(mutation: any, data?: any): void;
    generateSequence(): number[];
}
import Lobby from "./Lobby";
