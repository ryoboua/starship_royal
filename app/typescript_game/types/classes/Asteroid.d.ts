export default class Asteroid {
    static createAsteroid(pos: any): Asteroid;
    constructor(pos: any);
    pos: Vector;
    vel: Vector;
    health: number;
    initHealth: number;
    destroid: boolean;
    body: any;
    breakPiece(y: any, x: any): void;
    setHealth(): void;
    getHealth(): number;
    isDestroyed(): boolean;
    destroy(): void;
}
import Vector from "./Vector";
