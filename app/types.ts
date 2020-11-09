import io from "socket.io"
import SocketIOClient from 'socket.io-client'

export type SocketType = io.Socket

export type Sequence = Array<number> | null
export type GameType = "single" | "multi"

export type ClientSocket = SocketIOClient.Socket