const BG_COLOUR = "#231f20"
const SHIP_COLOUR = "#e66916"

const socket = io("http://localhost:3000")

const gameScreen = document.getElementById("gameScreen")
const initialScreen = document.getElementById("initialScreen")

let canvas, ctx
let playerNumber
let gameActive = false


socket.on("init", () => init())
socket.on("gameState", handleGameState)

const keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    spacebar: false
}

function init() {
  canvas = document.getElementById("canvas")
  ctx = canvas.getContext("2d")

  canvas.width = 1000
  canvas.height = 600

  document.addEventListener("keydown", keydown)
  document.addEventListener("keyup", keyup)
}

function keyup(e) {
  socket.emit("keyup", e.keyCode)
}

function keydown(e) {
  socket.emit("keydown", e.keyCode)
}

function paintGame(state) {
  const { player, gridsize } = state
  ctx.fillStyle = BG_COLOUR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const size = canvas.width / gridsize
  ctx.fillStyle = SHIP_COLOUR
  ctx.fillRect(player.pos.x * size, player.pos.y * size, size, size)
}

function handleGameState(gameState) {
  gameState = JSON.parse(gameState)
  requestAnimationFrame(() => paintGame(gameState))
}

