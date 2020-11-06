export default class Lobby {
    players: {};
    roundActive: boolean;
    addPlayer(player: any): void;
    removePlayer(socketId: any): void;
    getPlayerList(): any[];
    setRoundStatus(b: any): void;
    isRoundActive(): boolean;
}
