export default class AsteroidField {
    asteroids: Asteroid[];
    sequence: Generator<any, void, unknown> | null;
    _s: any;
    generateAsteroid(numOfAsteroids: any): void;
    generateAsteroidPositionFromSequence(): {
        x: any;
        y: number;
    };
    updatePosition(): void;
    removeDestroidAsteroids(): void;
    setSequence(sequence: any): void;
    resetSequenceGenerator(): void;
    sequenceGenerator(): Generator<any, void, unknown>;
}
import Asteroid from "./Asteroid";
