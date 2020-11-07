import Vector from "./Vector";
export default class Asteroid {
    pos: Vector;
    vel: Vector;
    health: number;
    initHealth: number;
    destroid: boolean;
    body: any;
    constructor(pos?: Vector);
    static createAsteroid(pos?: Vector): Asteroid;
    breakPiece(y: number, x: number): void;
    setHealth(): void;
    getHealth(): number;
    isDestroyed(): boolean;
    destroy(): void;
}
