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
        <input v-model="code" type="text" />
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
      code: null,
    }
  },
  methods: {
    handleNewGame() {
      this.$socket.emit("newGame")
    },
    handleJoinGame() {
      this.$socket.emit("joinGame", this.code)
    },
  },
  sockets: {
    connect() {
      console.log("we up!")
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
