<template>
  <canvas ref="canvas"></canvas>
</template>
<script lang="ts">
import Vue from "vue";
import { mapState, mapActions } from "vuex";
import { RootState } from "../../interfaces";
import Player from "../../game/classes/Player";

export default Vue.extend({
  name: "Canvas",
  data() {
    return {
      BG_COLOUR: "#231f20",
      SHIP_COLOURS: ["#e66916", "#29abe0", "#93c54b", "#FF1493"],
      ASTEROID_COLOUR: "#cdc9c3",
      MISSILE_COLOUR: "#FF6347",
    };
  },
  computed: mapState({
    gameState: (state: RootState) => state.game.gameState,
  }),
  watch: {
    gameState(value) {
      requestAnimationFrame(() => this.paintGame(value));
    },
  },
  methods: {
    ...mapActions("game", ["handleKeyDown", "handleKeyUp"]),
    keydown(e) {
      this.handleKeyDown(e.keyCode);
    },
    keyup(e) {
      this.handleKeyUp(e.keyCode);
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

      Object.values(players).forEach((player: Player) => {
        if (!player.isAlive) {
          return;
        }
        const body = player.body;
        ctx.fillStyle = this.SHIP_COLOURS[player.playerNumber - 1];
        for (let y = 0; y < body.length; y++) {
          for (let x = 0; x < body[y].length; x++) {
            if (body[y][x])
              ctx.fillRect(
                x * gridsize + player.pos.x,
                y * gridsize + player.pos.y,
                gridsize,
                gridsize
              );
          }
        }
      });
    },
    paintAsteroidField(state) {
      const ctx = this.$refs.canvas.getContext("2d");
      const { asteroidField, gridsize } = state;

      ctx.fillStyle = this.ASTEROID_COLOUR;
      asteroidField.asteroids.forEach((ast) => {
        const body = ast.body;
        for (let y = 0; y < body.length; y++) {
          for (let x = 0; x < body[y].length; x++) {
            if (body[y][x])
              ctx.fillRect(
                x * gridsize + ast.pos.x,
                y * gridsize + ast.pos.y,
                gridsize,
                gridsize
              );
          }
        }
      });
    },
    paintMissiles(state) {
      const ctx = this.$refs.canvas.getContext("2d");
      const { players, gridsize } = state;

      Object.values(players).forEach((player) => {
        if (!player.weapons.missiles.length || !player.isAlive) {
          return;
        }

        ctx.fillStyle = this.SHIP_COLOURS[player.playerNumber - 1];
        player.weapons.missiles.forEach((mis) => {
          const body = mis.body;
          for (let y = 0; y < body.length; y++) {
            for (let x = 0; x < body[y].length; x++) {
              if (body[y][x])
                ctx.fillRect(
                  x * gridsize + mis.pos.x,
                  y * gridsize + mis.pos.y,
                  gridsize,
                  gridsize
                );
            }
          }
        });
      });
    },
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
  },
});
</script>
<style lang="scss" scoped>
canvas {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}
</style>
