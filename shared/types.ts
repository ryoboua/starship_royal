import io from "socket.io"
import SocketIOClient from 'socket.io-client'

export type BackendSocket = io.Socket
export type FrontendSocket = SocketIOClient.Socket

export type Sequence = Array<number> | null
export type GameType = "single" | "multi"

