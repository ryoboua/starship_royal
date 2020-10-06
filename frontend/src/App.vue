<template>
  <div id="app">
    <Modal v-if="false">
      <h3 slot="header">custom sds</h3>
    </Modal>
    <HomeScreen v-if="!roomName" />
    <Game v-else />
  </div>
</template>

<script>
import HomeScreen from "./components/HomeScreen.vue"
import Game from "./components/Game.vue"
import Modal from "./components/Modal.vue"

export default {
  name: "App",
  components: {
    HomeScreen,
    Game,
    Modal,
  },
  computed: {
    playerNumber() {
      return this.$store.state.client.playerNumber
    },
    roomName() {
      return this.$store.state.client.roomName
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
