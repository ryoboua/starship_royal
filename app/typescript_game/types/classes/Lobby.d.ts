import { IClient } from "./Interfaces";
import Player from "./Player";
export default class Lobby {
    players: {
        [socketId: string]: Player;
    };
    roundActive: boolean;
    constructor();
    addPlayer(client: IClient): void;
    removePlayer(socketId: string): void;
    getPlayerList(): Array<Player>;
    setRoundStatus(b: boolean): void;
    isRoundActive(): boolean;
}
