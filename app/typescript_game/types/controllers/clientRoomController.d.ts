export function createRoom(roomName: any, players: any, emit: any): void;
export function addPlayer(roomName: any, client: any, socket: any, resFn: any): void;
export function removePlayer(roomName: any, socketId: any): void;
export function gameKeyDown(client: any, keyCode: any, socket: any): void;
export function gameKeyUp(client: any, keyCode: any, socket: any): void;
export function startRound(roomName: any): void;
export function endRound(roomName: any): void;
export function isRoundActive(roomName: any): any;
