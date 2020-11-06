export default class Player extends Client {
    constructor(client: any);
    score: number;
    pos: Vector;
    vel: Vector;
    keys: Keys;
    weapons: any;
    isAlive: boolean;
    left: boolean;
    body: number[][];
    reset(): void;
    selfDestruct(): void;
    updatePosition(asteroidField: any, isLocal: any): void;
    updateSpaceshipPosition(asteroidField: any, isLocal: any): void;
    updateVelocityKeyDown(keyCode: any): void;
    updateVelocityKeyUp(keyCode: any): void;
    fireMissile(): void;
}
import Client from "./Client";
import Vector from "./Vector";
import Keys from "./Keys";
