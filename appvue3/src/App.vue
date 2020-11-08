<template>
  <div id="app">
    <StartMenu />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StartMenu from "./components/StartMenu.vue";

export default defineComponent({
  name: "App",
  components: {
    StartMenu,
  },
});
</script>

<style scoped lang="scss">
#app {
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100%;
  background-color: $primary-color;
}
</style>