import { ActionContext } from "vuex";
import Vector from "../game/classes/Vector"
import Keys from "../game/classes/Keys"
import Missiles from "../game/classes/Missiles"
import Asteroid from "../game/classes/Asteroid"
import Player from "../game/classes/Player"
import Game from "../game/classes/Game"
import AsteroidField from "../game/classes/AsteroidField"
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
export interface KeyEvent {
    keyCode: number,
    socketId: string
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
    playerNumber: number
    host: boolean | null

}

export type Blueprint = Array<Array<number>>

export interface PlayerModel {
    score: number
    pos: Vector
    vel: Vector
    keys: Keys
    weapons: Missiles
    isAlive: boolean
    left: boolean
    body: Blueprint
}
export interface Players {
    [socketId: string]: Player
}


export interface AsteroidFieldModel {
    asteroids: Asteroid[]
    sequence: Generator | null
    readonly _s: Sequence
}

export interface MissileModel {
    pos: Vector
    vel: Vector
    value: number
    body: Blueprint
}

export interface GameModel {
    levels: Level[]
    asteroidField: AsteroidField
    gridsize: number
    timer: number
    _context: any
}

type PlayerScores = Array<{
    name: string
    score: number
}>

///Modal

export interface ModalStore {
    showModal: boolean
    header: string
    body: string
}

export interface Modal {
    header: string
    body: string
}

//// Frontend Store

// tslint:disable no-empty-interface
export interface ClientStore extends ClientModel { }

export interface GameStore {
    _gameInstance: Game | null
    gameActive: boolean
    gameState: GameState | null
    type: GameType
    level: Object
    timer: number | null
    players: ClientModel[]
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

export interface RootState {
    client: ClientStore
    game: GameStore
    modal: ModalStore
}

export type GameActionContext = ActionContext<GameStore, RootState>


// Frontend - Backend payload contracts

export type joinGameResponseCallBack = {
    (payload: joinGameResponse | null, err?: Modal): void
}

export interface joinGameResponse {
    client: ClientModel
    players: Players
}

export interface BackendCommit {
    mutation: Mutations
    data?: any
}

export type ClientRoomEmitter = (roomName: string) => Emit
export type Emit = (commit: BackendCommit) => void