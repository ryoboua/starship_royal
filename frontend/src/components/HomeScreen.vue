<template>
  <section class="homeScreen_container">
    <div class="homeScreen__title">
      <h1>Starship Royal</h1>
    </div>
    <div class="homeScreen__menu">
      <div>
        <h3>Your Name</h3>
        <input type="text" v-model="name" />
      </div>
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
      name: "Tester",
    }
  },
  methods: {
    handleNewGame() {
      this.$socket.emit("NEW_GAME", this.name)
    },
    handleJoinGame() {
      this.$socket.emit("JOIN_GAME", {
        roomName: this.roomName,
        name: this.name,
      })
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
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
