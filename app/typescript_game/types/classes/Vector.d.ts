export default class Vector {
    private _x;
    private _y;
    constructor(_x: number, _y: number);
    static add(v1: Vector, v2: Vector): Vector;
    static sub(v1: Vector, v2: Vector): Vector;
    static random(minX: number, maxX: number, minY: number, maxY: number): Vector;
    set x(x: number);
    get x(): number;
    set y(y: number);
    get y(): number;
    setX(x: number): void;
    setY(y: number): void;
    getX(): number;
    getY(): number;
}
