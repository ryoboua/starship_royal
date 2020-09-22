<template>
  <div class="game_panel">
    <div class="game_screen">
      <canvas ref="canvas"></canvas>
    </div>
    <aside>
      <h3>Room Name: {{ roomName }}</h3>
      <h4>Player Number:{{ playerNumber }}</h4>
      <button @click="handleStartGame">Start Game</button>
    </aside>
  </div>
</template>
<script>
export default {
  name: "Game",
  props: {},
  data() {
    return {
      BG_COLOUR: "#231f20",
      SHIP_COLOURS: ["#e66916", "#29abe0", "#93c54b", "#FF1493"],
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
      const { players, gridsize } = state

      players.forEach((player) => {
        ctx.fillStyle = this.SHIP_COLOURS[player.playerNumber - 1]
        //center block
        ctx.fillRect(player.pos.x, player.pos.y, gridsize, gridsize)
        //left block
        ctx.fillRect(player.pos.x - gridsize, player.pos.y, gridsize, gridsize)
        //top block
        ctx.fillRect(player.pos.x, player.pos.y - gridsize, gridsize, gridsize)
        //right block
        ctx.fillRect(player.pos.x + gridsize, player.pos.y, gridsize, gridsize)
      })
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
      const { players, gridsize } = state

      players.forEach((player) => {
        if (!player.weapons.missiles.length) {
          return
        }

        ctx.fillStyle = this.SHIP_COLOURS[player.playerNumber - 1]//this.MISSILE_COLOUR
        player.weapons.missiles.forEach((mis) => {
          ctx.fillRect(mis.pos.x, mis.pos.y, gridsize, gridsize)
        })
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
<style lang="scss" scoped>
.game_panel {
  display: grid;
  grid-template-columns: 1000px 1fr;
  grid-template-rows: auto;
}
aside {
}
</style>
