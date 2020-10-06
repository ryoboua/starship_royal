<template>
  <div class="game_panel">
    <div class="game_screen">
      <canvas ref="canvas"></canvas>
    </div>
    <aside>
      <h3>Room Name: {{ roomName }}</h3>
      <h4>Name {{ name }}</h4>
      <h4>Player Number:{{ playerNumber }}</h4>
      <div v-if="!gameActive">
        <h4>Current players in Lobby</h4>
        <ul>
          <li v-for="(p, i) in players" :key="i">
            {{ p.name }}
          </li>
        </ul>
        <button v-if="isHost" @click="handleStartGame">Start Game</button>
      </div>
      <ul v-if="gameActive">
        <h2>Timer: {{ timer }}</h2>
        <li v-for="(p, i) in playerScores" :key="i">
          {{ p.name }} : {{ p.score }}
        </li>
      </ul>
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
      playerScores: [],
      timer: null,
    }
  },
  computed: {
    playerNumber() {
      return this.$store.state.playerNumber
    },
    roomName() {
      return this.$store.state.roomName
    },
    name() {
      return this.$store.state.name
    },
    players() {
      return this.$store.state.players
    },
    gameActive() {
      return this.$store.state.gameActive
    },
    isHost() {
      return this.$store.state.host
    },
  },
  methods: {
    handleStartGame() {
      this.$socket.emit("START_GAME")
    },
    keydown(e) {
      this.$socket.emit("KEY_DOWN", e.keyCode)
    },
    keyup(e) {
      this.$socket.emit("KEY_UP", e.keyCode)
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

      Object.values(players).forEach((player) => {
        if (!player.isAlive) {
          return
        }
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

      Object.values(players).forEach((player) => {
        if (!player.weapons.missiles.length || !player.isAlive) {
          return
        }

        ctx.fillStyle = this.SHIP_COLOURS[player.playerNumber - 1]
        player.weapons.missiles.forEach((mis) => {
          ctx.fillRect(mis.pos.x, mis.pos.y, gridsize, gridsize)
        })
      })
    },
  },
  sockets: {
    GAME_STATE_UPDATE(gameState) {
      gameState = JSON.parse(gameState)
      this.playerScores = gameState.playerScores
      this.timer = gameState.timer
      requestAnimationFrame(() => this.paintGame(gameState))
    },
    CLEAR_CANVAS() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")

      canvas.width = 1000
      canvas.height = 600
      ctx.clearRect(0, 0, canvas.width, canvas.height)
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
