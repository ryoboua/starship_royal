<template>
  <main class="game_panel">
    <section class="game_screen">
      <InformationScreen />
      <Canvas />
    </section>
    <SidePanel />
  </main>
</template>

<script>
import InformationScreen from "./InformationScreen.vue";
import Canvas from "./Canvas.vue";
import SidePanel from "./SidePanel.vue";

export default {
  name: "Main",
  components: {
    Canvas,
    InformationScreen,
    SidePanel
  },
  mounted() {
    this.$store.dispatch("client/createGame", 'Dave')
    this.$store.dispatch("game/startRound")
  }
};
</script>

<style lang="scss" scoped>
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
}
</style>