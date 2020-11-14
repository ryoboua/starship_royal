<template>
  <section class="homeScreen_container">
    <div class="homeScreen__title">
      <h1>Starship Royal</h1>
    </div>
    <div class="homeScreen__menu">
      <div>
        <input
          placeholder="Enter a name"
          type="text"
          v-model="name"
          :class="{ 'input-error': errors.name }"
        />
      </div>
      <div v-if="type === 'single'">
        <button @click="handleNewGame">Single Player</button>
        <h4>Or</h4>
        <button @click="handleMulti">Multiplayer Game</button>
      </div>
      <div v-if="type === 'multi'">
        <button @click="handleNewGame">Create Game</button>
        <h4>Or</h4>
        <input
          placeholder="Enter room code"
          v-model="roomName"
          type="text"
          :class="{ 'input-error': errors.roomName }"
        />
        <button @click="handleJoinGame">Join Game</button>
      </div>
      <div>
        <h5>
          Avoid the asteroids by move your ship with the ←↑↓→ or A,W,S,D keys
        </h5>
        <h5>Fire missisles by pressing and holding down SPACEBAR</h5>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "StartMenu",
  computed: mapState({
    type: (state) => state.game.type,
  }),
  data() {
    return {
      roomName: "",
      name: "",
      errors: {
        roomName: false,
        name: false,
      },
    };
  },
  watch: {
    roomName: function () {
      this.errors.roomName = false;
    },
    name: function () {
      this.errors.name = false;
    },
  },
  methods: {
    ...mapActions("game", ["setGameType"]),
    ...mapActions("client", ["createGame", "joinGame"]),
    handleMulti() {
      this.setGameType("multi");
      this.$socket.open();
    },
    handleNewGame() {
      if (this.name === "") {
        this.errors.name = true;
        return;
      }
      this.createGame(this.name);
    },
    handleJoinGame() {
      if (this.name === "") {
        this.errors.name = true;
      }
      if (this.roomName === "") {
        this.errors.roomName = true;
      }
      if (this.errors.name || this.errors.roomName) {
        return;
      }
      this.joinGame({
        roomName: this.roomName,
        name: this.name,
      });
    },
  },
  mounted() {
    this.name = this.$store.state.client.name;
  },
};
</script>

<style scoped lang="scss">
.homeScreen_container {
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
