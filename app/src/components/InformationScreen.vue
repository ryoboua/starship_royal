<template>
  <div
    v-if="!gameActive"
    v-html="screen"
    class="game_screen__information"
  ></div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "InformationScreen",
  computed: {
    ...mapState({
      gameActive: (state) => state.game.gameActive,
      screen: (state) => state.game.screen,
      isHost: (state) => state.client.host,
    }),
  },
  methods: {
    ...mapActions("game", ["displayMsg"]),
  },
  mounted() {
    const msg = this.isHost
      ? "<h3>Click Start Button To Start Round</h3>"
      : "<h3 v-else>Waiting For Host To Start Round</h3>";

    this.displayMsg(msg);
  },
};
</script>
<style lang="scss" scoped>
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
</style>
