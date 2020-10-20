<template>
  <div class="game_panel">
    <div class="game_screen">
      <canvas ref="canvas"></canvas>
      <div
        v-if="!gameActive"
        v-html="screen"
        class="game_screen__information"
      ></div>
    </div>
    <aside>
      <h3>
        Room Name:
        <span class="room_name">{{ roomName }}</span>
      </h3>
      <h4>Name: {{ name }}</h4>
      <h4>Player Number:{{ playerNumber }}</h4>
      <h4>Current Level: {{ level.number }}</h4>
      <div v-if="!gameActive">
        <button
          v-if="isHost"
          @click.once="handleStartGame"
          :disabled="disableStartBtn"
        >
          Start Round
        </button>
        <div v-if="type === 'multi'">
          <h4>Current players in lobby:</h4>
          <ul>
            <li v-for="(p, i) in players" :key="i">
              {{ p.name }}
            </li>
          </ul>
        </div>
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
import { mapState, mapActions } from "vuex";

export default {
  name: "Game",
  data() {
    return {
      BG_COLOUR: "#231f20",
      SHIP_COLOURS: ["#e66916", "#29abe0", "#93c54b", "#FF1493"],
      ASTEROID_COLOUR: "#cdc9c3",
      MISSILE_COLOUR: "#FF6347"
    };
  },
  computed: mapState({
    name: state => state.client.name,
    playerNumber: state => state.client.playerNumber,
    roomName: state => state.client.roomName,
    isHost: state => state.client.host,
    gameActive: state => state.game.gameActive,
    players: state => state.game.players,
    type: state => state.game.type,
    level: state => state.game.level,
    timer: state => state.game.timer,
    playerScores: state => state.game.playerScores,
    gameState: state => state.game.gameState,
    screen: state => state.game.screen,
    disableStartBtn: state => state.game.disableStartBtn
  }),
  watch: {
    gameState(value) {
      requestAnimationFrame(() => this.paintGame(value));
    }
  },
  methods: {
    ...mapActions("game", [
      "startRound",
      "handleKeyDown",
      "handleKeyUp",
      "displayMsg"
    ]),
    handleStartGame() {
      this.clearGameScreenInformation();
      this.startRound();
    },
    keydown(e) {
      this.handleKeyDown(e.keyCode);
      //this.$socket.emit("KEY_DOWN", e.keyCode);
    },
    keyup(e) {
      this.handleKeyUp(e.keyCode);
      //this.$socket.emit("KEY_UP", e.keyCode);
    },
    clearGameScreenInformation() {
      this.displayMsg("");
    },
    paintGame(state) {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");

      canvas.width = 1000;
      canvas.height = 600;

      ctx.fillStyle = this.BG_COLOUR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      this.paintPlayer(state);
      this.paintAsteroidField(state);
      this.paintMissiles(state);
    },
    paintPlayer(state) {
      const ctx = this.$refs.canvas.getContext("2d");
      const { players, gridsize } = state;

      Object.values(players).forEach(player => {
        if (!player.isAlive) {
          return;
        }
        ctx.fillStyle = this.SHIP_COLOURS[player.playerNumber - 1];
        //center block
        ctx.fillRect(player.pos.x, player.pos.y, gridsize, gridsize);
        //left block
        ctx.fillRect(player.pos.x - gridsize, player.pos.y, gridsize, gridsize);
        //top block
        ctx.fillRect(player.pos.x, player.pos.y - gridsize, gridsize, gridsize);
        //right block
        ctx.fillRect(player.pos.x + gridsize, player.pos.y, gridsize, gridsize);
      });
    },
    paintAsteroidField(state) {
      const ctx = this.$refs.canvas.getContext("2d");
      const { asteroidField, gridsize } = state;

      ctx.fillStyle = this.ASTEROID_COLOUR;
      asteroidField.asteroids.forEach(ast => {
        ctx.fillRect(ast.pos.x, ast.pos.y, 1.5 * gridsize, 1.5 * gridsize);
      });
    },
    paintMissiles(state) {
      const ctx = this.$refs.canvas.getContext("2d");
      const { players, gridsize } = state;

      Object.values(players).forEach(player => {
        if (!player.weapons.missiles.length || !player.isAlive) {
          return;
        }

        ctx.fillStyle = this.SHIP_COLOURS[player.playerNumber - 1];
        player.weapons.missiles.forEach(mis => {
          ctx.fillRect(mis.pos.x, mis.pos.y, gridsize, gridsize);
        });
      });
    }
  },
  mounted() {
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);

    const canvas = this.$refs.canvas;
    const ctx = canvas.getContext("2d");

    canvas.width = 1000;
    canvas.height = 600;

    ctx.fillStyle = this.BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const msg = this.isHost
      ? "<h3>Click Start Button To Start Round</h3>"
      : "<h3 v-else>Waiting For Host To Start Round</h3>";

    this.displayMsg(msg);
  }
};
</script>
<style lang="scss" scoped>
$BG_COLOUR: #231f20;

.game_panel {
  display: grid;
  grid-template-columns: 1000px 1fr;
  grid-template-rows: auto;
}

.game_screen {
  position: relative;
  border: 10px solid #ac4b1c;
  height: 600px;
  width: 1000px;
  background-color: $BG_COLOUR;

  canvas {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
  }
}
.game_screen__information {
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 5;
  /deep/ h3,
  /deep/ h2,
  /deep/ h1 {
    color: $primary-color;
    align-self: center;
  }
}

.room_name {
  color: $button-primary;
}
</style>
