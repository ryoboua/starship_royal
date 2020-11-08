import Vector from "./Vector"
import Keys from "./Keys"
import Missiles from "./Missiles"
import Asteroid from "./Asteroid"
import { Sequence } from "./Types"
import AsteroidField from "./AsteroidField"

export interface Point2D {
    x: number,
    y: number
}

export interface IKeys {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
    spacebar: boolean
}

export interface Level {
    number: number
    numOfAsteroids: number
    asteroidFieldTimeInterval: number
}

export interface IClient {
    socketId: string
    name: string
    roomName: string
    playerNumber: number
    host: boolean

}

export interface IPlayer {
    score: number
    pos: Vector
    vel: Vector
    keys: Keys
    weapons: Missiles
    isAlive: boolean
    left: boolean
    body: Array<Array<number>>
}

export interface IAsteroidField {
    asteroids: Array<Asteroid>
    sequence: Generator | null
    readonly _s: Sequence
}

export interface IMissile {
    pos: Vector
    vel: Vector
    value: number
    body: Array<Array<number>>
}

export interface IGame {
    levels: Array<Level>
    asteroidField: AsteroidField
    gridsize: number
    timer: number
    _context: any
}

export interface Event {
    eventName: string,
    data?: any
}