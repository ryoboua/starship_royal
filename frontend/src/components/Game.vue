<template>
  <div>
    <h3>Room Name: {{ roomName }}</h3>
    <h4>Player Number:{{ playerNumber }}</h4>
    <button @click="handleStartGame">Start Game</button>
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
export default {
  name: "Game",
  props: {},
  data() {
    return {
      BG_COLOUR: "#231f20",
      SHIP_COLOUR: "#e66916",
      ASTEROID_COLOUR: "#fbfbf8",
      MISSILE_COLOUR: "#FF6347",
      ctx: null,
    }
  },
  computed: {
    playerNumber() {
      return this.$store.state.playerNumber
    },
    roomName() {
      return this.$store.state.roomName
    },
  },
  methods: {
    handleStartGame() {
        this.$socket.emit("startGame")
    },
    keydown(e) {
      this.$socket.emit("keydown", e.keyCode)
    },
    keyup(e) {
      this.$socket.emit("keyup", e.keyCode)
    },
    paintGame(state) {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")

      canvas.width = 1000
      canvas.height = 600

      ctx.fillStyle = this.BG_COLOUR
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      this.paintPlayer(state)
      this.paintAsteroidField(state)
      this.paintMissiles(state)
    },
    paintPlayer(state) {
      const ctx = this.$refs.canvas.getContext("2d")
      const { player, gridsize } = state

      ctx.fillStyle = this.SHIP_COLOUR
      //center block
      ctx.fillRect(player.pos.x, player.pos.y, gridsize, gridsize)
      //left block
      ctx.fillRect(player.pos.x - gridsize, player.pos.y, gridsize, gridsize)
      //top block
      ctx.fillRect(player.pos.x, player.pos.y - gridsize, gridsize, gridsize)
      //right block
      ctx.fillRect(player.pos.x + gridsize, player.pos.y, gridsize, gridsize)
    },
    paintAsteroidField(state) {
      const ctx = this.$refs.canvas.getContext("2d")
      const { asteroidField, gridsize } = state

      ctx.fillStyle = this.ASTEROID_COLOUR
      asteroidField.asteroids.forEach((ast) => {
        ctx.fillRect(ast.pos.x, ast.pos.y, 1.5 * gridsize, 1.5 * gridsize)
      })
    },
    paintMissiles(state) {
      const ctx = this.$refs.canvas.getContext("2d")
      const { player, gridsize } = state

      if (!player.weapons.missiles.length) {
        return
      }

      ctx.fillStyle = this.MISSILE_COLOUR
      player.weapons.missiles.forEach((mis) => {
        ctx.fillRect(mis.pos.x, mis.pos.y, gridsize, gridsize)
      })
    },
  },
  sockets: {
    gameState(gameState) {
      gameState = JSON.parse(gameState)
      requestAnimationFrame(() => this.paintGame(gameState))
    },
    gameOver() {
      alert("Game Over")
    },
  },
  mounted() {
    document.addEventListener("keydown", this.keydown)
    document.addEventListener("keyup", this.keyup)
  },
}
</script>
<style lang="sass" scoped></style>
