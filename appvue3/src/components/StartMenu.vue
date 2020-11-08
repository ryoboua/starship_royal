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
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

interface IErrors {
  roomName: boolean;
  name: boolean;
}
type GameType = "single" | "multi";

export default defineComponent({
  name: "StartMenu",
  setup(props) {
    let name = ref<string>("");
    let roomName = ref<string>("");
    let type = ref<GameType>("single");
    const errors: IErrors = reactive({
      roomName: false,
      name: false,
    });

    function handleNewGame() {
      if (name.value === "") {
        errors.name = true;
        return;
      }
    }

    function handleMulti() {
      type.value = "multi";
    }

    function handleJoinGame() {
      if (name.value === "") {
        errors.name = true;
      }
      if (roomName.value === "") {
        errors.roomName = true;
      }
      if (errors.name || errors.roomName) {
        return;
      }
    }

    return {
      name,
      roomName,
      errors,
      type,
      handleNewGame,
      handleMulti,
      handleJoinGame,
    };
  },
});
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
