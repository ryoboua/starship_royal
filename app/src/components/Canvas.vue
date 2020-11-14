<template>
  <canvas ref="canvas"></canvas>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
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
    gameState: (state) => state.game.gameState,
  }),
  watch: {
    gameState(newState) {
      requestAnimationFrame(() => this.paintGame(newState));
    },
  },
  methods: {
    ...mapActions("game", ["handleKeyDown", "handleKeyUp"]),
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

      Object.values(players).forEach((player) => {
        if (!player.isAlive) {
          return;
        }
        const { body } = player;
        ctx.fillStyle = this.SHIP_COLOURS[player.playerNumber - 1];
        for (let y = 0; y < body.length; y++) {
          for (let x = 0; x < body[y].length; x++) {
            if (body[y][x]) {
              ctx.fillRect(
                x * gridsize + player.pos.x,
                y * gridsize + player.pos.y,
                gridsize,
                gridsize
              );
            }
          }
        }
      });
    },
    paintAsteroidField(state) {
      const ctx = this.$refs.canvas.getContext("2d");
      const { asteroidField, gridsize } = state;

      ctx.fillStyle = this.ASTEROID_COLOUR;
      asteroidField.asteroids.forEach((ast) => {
        const { body } = ast;
        for (let y = 0; y < body.length; y++) {
          for (let x = 0; x < body[y].length; x++) {
            if (body[y][x]) {
              ctx.fillRect(
                x * gridsize + ast.pos.x,
                y * gridsize + ast.pos.y,
                gridsize,
                gridsize
              );
            }
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
          const { body } = mis;
          for (let y = 0; y < body.length; y++) {
            for (let x = 0; x < body[y].length; x++) {
              if (body[y][x]) {
                ctx.fillRect(
                  x * gridsize + mis.pos.x,
                  y * gridsize + mis.pos.y,
                  gridsize,
                  gridsize
                );
              }
            }
          }
        });
      });
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);

    const canvas = this.$refs.canvas;
    const ctx = canvas.getContext("2d");

    canvas.width = 1000;
    canvas.height = 600;

    ctx.fillStyle = this.BG_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
};
</script>
<style lang="scss" scoped>
canvas {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
}
</style>
