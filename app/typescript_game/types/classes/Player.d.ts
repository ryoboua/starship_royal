import Client from "./Client";
import Vector from "./Vector";
import Keys from "./Keys";
import Missiles from "./Missiles";
import { IPlayer, IClient } from "./Interfaces";
import AsteroidField from "./AsteroidField";
export default class Player extends Client implements IPlayer {
    score: number;
    pos: Vector;
    vel: Vector;
    keys: Keys;
    weapons: Missiles;
    isAlive: boolean;
    left: boolean;
    body: Array<Array<number>>;
    constructor(client: IClient);
    reset(): void;
    selfDestruct(): void;
    updatePosition(asteroidField: AsteroidField, isLocal: boolean): void;
    updateSpaceshipPosition(asteroidField: AsteroidField, isLocal: boolean): void;
    updateVelocityKeyDown(keyCode: number): void;
    updateVelocityKeyUp(keyCode: number): void;
    fireMissile(): void;
}
