import Asteroid from "./Asteroid";
import { IAsteroidField } from "./Interfaces";
import { Point2D } from "./Interfaces";
import { Sequence } from "./Types";
export default class AsteroidField implements IAsteroidField {
    asteroids: Array<Asteroid>;
    sequence: Generator | null;
    _s: Sequence;
    constructor();
    generateAsteroid(numOfAsteroids: number): void;
    generateAsteroidPositionFromSequence(): Point2D;
    updatePosition(): void;
    removeDestroidAsteroids(): void;
    setSequence(sequence: Sequence): void;
    resetSequenceGenerator(): void;
    sequenceGenerator(): Generator<number, void, unknown>;
}
