const BG_COLOUR = "#231f20"
const SHIP_COLOUR = "#e66916"
const ASTEROID_COLOUR = "#fbfbf8"
const MISSILE_COLOUR = "#FF6347"

const socket = io("http://localhost:3000")

const gameScreen = document.getElementById("gameScreen")
const initialScreen = document.getElementById("initialScreen")

let canvas, ctx
let playerNumber
let gameActive = false

socket.on("init", () => init())
socket.on("gameState", handleGameState)
socket.on("gameOver", handleGameOver)

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
  ctx.fillStyle = BG_COLOUR
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  paintPlayer(state)
  paintAsteroidField(state)
  paintMissiles(state)
}

function paintPlayer(state) {
  const { player, gridsize } = state
  ctx.fillStyle = SHIP_COLOUR
  //center block
  ctx.fillRect(player.pos.x, player.pos.y, gridsize, gridsize)
  //left block
  ctx.fillRect(player.pos.x - gridsize, player.pos.y, gridsize, gridsize)
  //top block
  ctx.fillRect(player.pos.x, player.pos.y - gridsize, gridsize, gridsize)
  //right block
  ctx.fillRect(player.pos.x + gridsize, player.pos.y, gridsize, gridsize)
}

function paintAsteroidField(state) {
  const { asteroidField, gridsize } = state

  ctx.fillStyle = ASTEROID_COLOUR
  asteroidField.asteroids.forEach((ast) => {
    ctx.fillRect(ast.pos.x, ast.pos.y, 1.5 * gridsize, 1.5 * gridsize)
  })
}

function paintMissiles(state) {
  const { player, gridsize } = state

  if (!player.weapons.missiles.length) {
    return
  }

  ctx.fillStyle = MISSILE_COLOUR
  player.weapons.missiles.forEach((mis) => {
    ctx.fillRect(mis.pos.x, mis.pos.y, gridsize, gridsize)
  })
}

function handleGameState(gameState) {
  gameState = JSON.parse(gameState)
  requestAnimationFrame(() => paintGame(gameState))
}

function handleGameOver() {
  alert('Game Over')
}
