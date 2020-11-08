import io from "socket.io"

export type SocketType = io.Socket

export type Sequence = Array<number> | null
export type GameType = "single" | "multi"