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
      MISSILE_COLOUR: "#FF6347"
    };
  },
  computed: mapState({
    gameState: state => state.game.gameState
  }),
  watch: {
    gameState(value) {
      requestAnimationFrame(() => this.paintGame(value));
    }
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
  }
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
