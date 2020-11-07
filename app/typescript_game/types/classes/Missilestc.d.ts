import Missile from "./Missile";
import Vector from "./Vector";
export default class Missiles {
    private missiles;
    constructor();
    generateMissile(pos: Vector): void;
    updateMissilePositions(asteroidField: any): void;
    removeMissiles(missArr: Array<Missile>): void;
}
