<template>
  <section class="homeScreen_container">
    <div class="homeScreen__title">
      <h1>Starship Royal</h1>
    </div>
    <div class="homeScreen__menu">
      <div>
        <button @click="handleNewGame">Create Game</button>
      </div>
      <div>
        <input v-model="roomName" type="text" />
        <button @click="handleJoinGame">Join Game</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeScreen",
  data() {
    return {
      roomName: null,
    }
  },
  methods: {
    handleNewGame() {
      this.$socket.emit("NEW_GAME")
    },
    handleJoinGame() {
      this.$socket.emit("JOIN_GAME", this.roomName)
    },
  },
  sockets: {
    connect() {
      console.log("Connected")
    },
  },
}
</script>

<style scoped lang="scss">
.homeScreen_container {
  //height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
