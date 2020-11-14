import Vector from "./Vector"
import { ASTEROID_STEP, GAME_WIDTH, GRID_SIZE } from "../constants"
import asteroidBlueprints from "../blueprints/asteroids"
import { Blueprint } from "../../shared/interfaces"

export default class Asteroid {
    public pos: Vector
    public vel: Vector
    public health: number
    private initHealth: number
    public destroid: boolean
    public body: Blueprint

    constructor(pos?: Vector) {
        this.pos = pos ? pos : Vector.random(0, GAME_WIDTH, 0, 0)
        this.vel = new Vector(0, ASTEROID_STEP)
        this.health = 0
        this.initHealth = 0
        this.destroid = false
        this.body = [
            [0, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 0]
        ]
    }

    static createAsteroid(pos?: Vector) {
        const ast = new Asteroid(pos)
        ast.setHealth()

        return ast

    }

    breakPiece(y: number, x: number) {
        this.body[y][x] = 0
        this.health--
        this.vel = Vector.add(this.vel, new Vector(0, -0.05))

        if (this.health < Math.ceil(this.initHealth * 0.25)) {
            this.destroid = true
        }
    }

    setHealth() {
        let health = 0
        const body = this.body;

        for (let y = 0; y < body.length; y++) {
            for (let x = 0; x < body[y].length; x++) {
                if (body[y][x]) health++
            }
        }

        this.initHealth = health
        this.health = health
    }

    destroy() {
        this.destroid = true
    }

    playerCollisionCheck(missileBodyCoordinates: Vector[]): boolean {
        let hit = false
        for (let y = 0; y < this.body.length; y++) {
            for (let x = 0; x < this.body[y].length; x++) {
                if (this.body[y][x]) {
                    const posY = (y * GRID_SIZE) + this.pos.y
                    const posX = (x * GRID_SIZE) + this.pos.x

                    hit = missileBodyCoordinates.some((coord) => {
                        return coord.x < posX + GRID_SIZE &&
                            coord.x + GRID_SIZE > posX &&
                            coord.y < posY + GRID_SIZE &&
                            coord.y + GRID_SIZE > posY
                    })

                    if (hit) {
                        this.breakPiece(y, x)
                        return hit
                    }
                }
            }
        }
        return hit
    }

    missileCollisionCheck(missileBodyCoordinates: Vector[]): boolean {
        let hit = false
        for (let y = 0; y < this.body.length; y++) {
            for (let x = 0; x < this.body[y].length; x++) {
                if (this.body[y][x]) {
                    const posY = (y * GRID_SIZE) + this.pos.y
                    const posX = (x * GRID_SIZE) + this.pos.x

                    missileBodyCoordinates.forEach((coord) => {
                        if (coord.x < posX + GRID_SIZE &&
                            coord.x + GRID_SIZE > posX &&
                            coord.y < posY + GRID_SIZE &&
                            coord.y + GRID_SIZE > posY) {
                            this.breakPiece(y, x)
                            hit = true

                        }
                    })

                }
            }
        }

        return hit
    }
}
