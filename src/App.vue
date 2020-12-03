<template>
  <div id="app">
    <StartMenu v-if="!roomName" />
    <Main v-else />

    <Modal v-if="showModal" @close="closeModal">
      <h3 slot="header">{{ header }}</h3>
      <p slot="body">{{ body }}</p>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import StartMenu from "./components/StartMenu.vue";
import Main from "./components/Main.vue";
import Modal from "./components/Modal.vue";

export default {
  name: "App",
  components: {
    StartMenu,
    Main,
    Modal,
  },
  computed: mapState({
    roomName: (state) => state.client.roomName,
    showModal: (state) => state.modal.showModal,
    header: (state) => state.modal.header,
    body: (state) => state.modal.body,
  }),
  methods: mapMutations("modal", ["closeModal"]),
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
