import { Point2D } from "./Interfaces";
export default class Vector implements Point2D {
    x: number;
    y: number;
    constructor(x: number, y: number);
    static add(v1: Vector, v2: Vector): Vector;
    static sub(v1: Vector, v2: Vector): Vector;
    static random(minX: number, maxX: number, minY: number, maxY: number): Vector;
    setX(x: number): void;
    setY(y: number): void;
    getX(): number;
    getY(): number;
}
