<template>
  <div id="app">
    <HomeScreen v-if="!roomName" />
    <Game v-else />

    <Modal v-if="showModal" @close="closeModal">
      <h3 slot="header">{{ header }}</h3>
      <p slot="body">{{ body }}</p>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import HomeScreen from "./components/HomeScreen.vue";
import Game from "./components/Game.vue";
import Modal from "./components/Modal.vue";

export default {
  name: "App",
  components: {
    HomeScreen,
    Game,
    Modal
  },
  compted: mapState({
    roomName: state => state.client.roomName,
    showModal: state => state.modal.showModal,
    header: state => state.modal.header,
    body: state => state.modal.body
  }),
  methods: mapMutations("modal", ["closeModal"])
};
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
