<template>
  <section class="homeScreen_container">
    <div class="homeScreen__title">
      <h1>Starship Royal</h1>
    </div>
    <div class="homeScreen__menu">
      <div>
        <input placeholder="Enter a name" type="text" v-model="name" />
      </div>
      <h4>And</h4>
      <div>
        <button @click="handleNewGame">Create Game</button>
        <h4>Or</h4>
        <input placeholder="Enter room code" v-model="roomName" type="text" />
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
      name: ""
    };
  },
  methods: {
    handleNewGame() {
      // if (this.name === "") {
      //   return
      // }
      this.$socket.emit("NEW_GAME", this.name);
    },
    handleJoinGame() {
      // if (this.name === "") {
      //   return
      // }
      // if (this.roomName === "") {
      //   return
      // }
      this.$socket.emit("JOIN_GAME", {
        roomName: this.roomName,
        name: this.name
      });
    }
  },
  sockets: {
    connect() {
      console.log("Connected");
    }
  }
};
</script>

<style scoped lang="scss">
.homeScreen_container {
  // height: 100%;
  // width: 100%;
  display: flex;
  flex-direction: column;
}

.homeScreen__title {
  margin-bottom: 2em;
}
.homeScreen__menu {
  div {
    padding: 1em;
  }
}
</style>
