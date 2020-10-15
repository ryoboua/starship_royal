export default {
  namespaced: true,
  state: {
    showModal: false,
    header: "",
    body: ""
  },
  mutations: {
    closeModal(state) {
      state.header = "";
      state.body = "";
      state.showModal = false;
    },
    setAndShowModal(state, { header, body }) {
      state.header = header;
      state.body = body;
      state.showModal = true;
    }
  },
  actions: {
    SOCKET_UNKNOWN_CODE(context, modal) {
      context.commit("setAndShowModal", modal);
    },
    SOCKET_TOO_MANY_PLAYERS(context, modal) {
      context.commit("setAndShowModal", modal);
    }
  }
};
