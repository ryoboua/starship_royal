import Vector from "./game/classes/Vector"
import Keys from "./game/classes/Keys"
import Missiles from "./game/classes/Missiles"
import Asteroid from "./game/classes/Asteroid"
import { Sequence } from "./types"
import AsteroidField from "./game/classes/AsteroidField"

export interface Point2D {
    x: number,
    y: number
}

export interface KeysModel {
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

export interface ClientModel {
    socketId: string | null
    name: string
    roomName: string
    playerNumber: number | null
    host: boolean | null

}

export interface PlayerModel {
    score: number
    pos: Vector
    vel: Vector
    keys: Keys
    weapons: Missiles
    isAlive: boolean
    left: boolean
    body: Array<Array<number>>
}

export interface AsteroidFieldModel {
    asteroids: Array<Asteroid>
    sequence: Generator | null
    readonly _s: Sequence
}

export interface MissileModel {
    pos: Vector
    vel: Vector
    value: number
    body: Array<Array<number>>
}

export interface GameModel {
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

export interface joinGameResponse {
    (): { res: any, err: any }
}

export interface StoreContext { rootState: { [propName: string]: any; }; state: { [propName: string]: any; }; commit: (...args: any[]) => void; dispatch: (...args: any[]) => void; }

