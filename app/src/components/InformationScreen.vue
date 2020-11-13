<template>
  <div v-if="!gameActive" class="game_screen__information">
    <h3 v-if="screen.msg">{{ screen.msg }}</h3>
    <h2 v-if="screen.endtype">{{ screen.endtype }}</h2>
    <h3 v-if="screen.reason">{{ reason }}</h3>
    <h3 v-if="screen.winner">Round winner is {{ screen.winner }}</h3>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { GAME_OVER_REASONS } from "../../game/constants";

export default {
  name: "InformationScreen",
  computed: {
    ...mapState({
      gameActive: (state) => state.game.gameActive,
      screen: (state) => state.game.screen,
      isHost: (state) => state.client.host,
    }),

    reason() {
      if (this.screen.reason === 1) {
        return "All Ships have crashed!";
      }
      if (this.screen.reason === 2) {
        return "Timer Ended";
      }
    },
  },
  data() {
    return {
      gameOverReasons: GAME_OVER_REASONS,
    };
  },
  methods: {
    ...mapActions("game", ["displayMsg"]),
  },
  mounted() {
    const msg = this.isHost
      ? "Click Start Button To Start Round"
      : "Waiting For Host To Start Round";

    this.displayMsg({ msg });
  },
};
</script>
<style lang="scss" scoped>
.game_screen__information {
  position: absolute;
  display: flex;
  flex-direction: column;
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
</style>
