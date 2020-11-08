import Vector from "./game/classes/Vector"
import Keys from "./game/classes/Keys"
import Missiles from "./game/classes/Missiles"
import Asteroid from "./game/classes/Asteroid"
import Player from "./game/classes/PLayer"
import Game from "./game/classes/Game"
import AsteroidField from "./game/classes/AsteroidField"
import { Sequence, GameType } from "./types"
import Mutations from "./mutations"

export interface Point2D {
    x: number
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
    socketId: string
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
export interface Players {
    [socketId: string]: Player
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
    eventName: string
    data?: any
}

export interface joinGameResponse {
    (): { res: any, err: any }
}

export interface StoreContext {
    rootState: { [propName: string]: any; }
    state: { [propName: string]: any }
    commit: (...args: any[]) => void
    dispatch: (...args: any[]) => void
}

type PlayerScores = Array<{
    name: string
    score: number
}>


export interface GameStore {
    _gameInstance: Game | null
    gameActive: boolean
    gameState: GameState | null
    type: GameType
    level: Object
    timer: number | null
    players: Array<ClientModel>
    playerScores: PlayerScores
    screen: string
    disableStartBtn: boolean


}

export interface GameState {
    players: Players
    asteroidField: AsteroidField,
    gridsize: number
    timer: number
    playerScores: PlayerScores

}

export interface Action {
    mutation: Mutations
    data?: any
}



