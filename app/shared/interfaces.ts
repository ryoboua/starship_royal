import { ActionContext } from "vuex";
import Vector from "../game/classes/Vector"
import Keys from "../game/classes/Keys"
import Missiles from "../game/classes/Missiles"
import Asteroid from "../game/classes/Asteroid"
import Player from "../game/classes/Player"
import Game from "../game/classes/Game"
import AsteroidField from "../game/classes/AsteroidField"
import { Sequence, GameType } from "./types"

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
    keyCode: number
    socketId: string
    pos?: Vector
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
    sequence: Generator | undefined
    readonly _s: Sequence | undefined
}

export interface MissileModel {
    pos: Vector
    vel: Vector
    value: number
    body: Blueprint
    destroyed: boolean
}

export interface GameModel {
    level: number
    levels: Level[]
    asteroidField: AsteroidField
    gridsize: number
    timer: number
    _context: GameActionContext | undefined
}

export type PlayerScores = Array<{
    name: string
    score: number
}>

export interface PlayerPositionUpdate {
    socketId: string
    pos: Vector
}

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
    screen: Screen
    disableStartBtn: boolean
}

export interface Screen {
    msg?: string
    endType?: string
    reason?: any
    winner?: any
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
    players: Player[]
}

export type ClientRoomEmitter = (roomName: string) => Emit
export type Emit = (action: string, payload: any) => void