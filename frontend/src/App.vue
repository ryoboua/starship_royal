<template>
  <div id="app">
    <HomeScreen v-if="!roomName" />
    <Game v-else />
  </div>
</template>

<script>
import HomeScreen from "./components/HomeScreen.vue"
import Game from "./components/Game.vue"

export default {
  name: "App",
  components: {
    HomeScreen,
    Game,
  },
  computed: {
    playerNumber() {
      return this.$store.state.playerNumber
    },
    roomName() {
      return this.$store.state.roomName
    },
  },
}
</script>

<style scoped lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100%;
}
</style>
