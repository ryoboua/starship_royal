<template>
  <div id="app">
    <div v-if="width < 1200 || height < 600" class="warning-message">
      <h3>
        Starship Royal is meant to be played with a minimum screen width and
        height of 1200px by 600px as well as with a physical keyword.
      </h3>
    </div>
    <StartMenu v-else-if="!roomName" />
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
  data() {
    return {
      width: null,
      height: null,
    };
  },
  computed: mapState({
    roomName: (state) => state.client.roomName,
    showModal: (state) => state.modal.showModal,
    header: (state) => state.modal.header,
    body: (state) => state.modal.body,
  }),
  methods: {
    ...mapMutations("modal", ["closeModal"]),
    resizeEvent() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
  },
  beforeMount() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },
  created() {
    window.addEventListener("resize", this.resizeEvent);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeEvent);
  },
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

.warning-message {
  padding: 1em;
  h3 {
    margin-top: 100px;
    line-height: 25px;
  }
}
</style>
