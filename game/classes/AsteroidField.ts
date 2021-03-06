import Asteroid from "./Asteroid"
import Vector from "./Vector"
import { AsteroidFieldModel, Point2D } from "../../shared/interfaces"
import { Sequence } from "../../shared/types"
import { GRID_SIZE } from "../constants"

export default class AsteroidField implements AsteroidFieldModel {
    asteroids: Asteroid[]
    sequence: Generator | undefined
    _s: Sequence | undefined

    constructor() {
        this.asteroids = []
        this.sequence
        this._s
    }

    generateAsteroid(numOfAsteroids: number): void {
        if (!numOfAsteroids) {
            return
        }

        const newLine = []

        for (let i = 0; i < numOfAsteroids; i++) {
            let pos
            if (this.sequence) {
                const { x, y }: Point2D = this.generateAsteroidPositionFromSequence()
                pos = new Vector(x, y)
            }
            const ast = Asteroid.createAsteroid(pos)
            newLine.push(ast)
        }
        this.asteroids.push(...newLine)
    }

    generateAsteroidPositionFromSequence(): Point2D {
        if (!this.sequence) {
            return { x: 0, y: 0 }
        }
        const { value, done } = this.sequence.next()
        const pos = { x: value ? value : 25, y: 0 }
        if (done) {
            this.resetSequenceGenerator()
        }
        return pos
    }

    updatePosition(): void {
        if (!this.asteroids.length) {
            return
        }
        this.removeDestroidAsteroids()

        this.asteroids.forEach((ast) => {
            const pos = Vector.add(ast.pos, ast.vel)
            if (pos.y + GRID_SIZE > 600) {
                ast.destroy()
            } else {
                ast.pos = pos
            }
        })

    }

    removeDestroidAsteroids(): void {
        this.asteroids = this.asteroids.filter((ast) => !ast.destroid)
    }

    setSequence(sequence: Sequence): void {
        if (!sequence) {
            return
        }
        this._s = sequence
        this.sequence = this.sequenceGenerator()
    }

    resetSequenceGenerator(): void {
        this.sequence = this.sequenceGenerator()
    }

    *sequenceGenerator() {
        let i = 0
        if (this._s) {
            while (i < this._s.length) {
                yield this._s[i++]
            }
            return
        }
    }
}
