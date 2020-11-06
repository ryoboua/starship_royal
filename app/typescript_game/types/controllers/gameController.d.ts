export function createGame(players: any, context: any): any;
export function addPlayer(game: any, player: any): any;
export function removePlayer(game: any, socketId: any): any;
export function gameHandleKeyDown(game: any, keyCode: any, socketId: any): void;
export function gameHandleKeyUp(game: any, keyCode: any, socketId: any): void;
export function handleStartRound(game: any, sequence: any): Promise<void>;
export function handleDeadPlayer(game: any, socketId: any): void;
