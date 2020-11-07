import Vector from "./Vector";
import { IMissile } from "./Interfaces";
export default class Missile implements IMissile {
    pos: Vector;
    vel: Vector;
    value: number;
    body: Array<Array<number>>;
    constructor(pos: Vector);
}
