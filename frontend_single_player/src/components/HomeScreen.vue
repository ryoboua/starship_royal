<template>
  <section class="homeScreen_container">
    <div class="homeScreen__title">
      <h1>Starship Royal</h1>
    </div>
    <div class="homeScreen__menu">
      <div>
        <button @click="handleSingle">Play Game</button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "HomeScreen",
  data() {
    return {};
  },
  methods: {
    ...mapActions("game", ["createSinglePlayerGame"]),
    handleSingle() {
      this.createSinglePlayerGame()
    }
  }
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
