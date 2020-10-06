export default {
  namespaced: true,
  state: {
    showModal: false,
    header: "",
    body: "",
  },
  mutations: {
    showModal(state) {
      state.showModal = true
    },
    closeModal(state) {
      state.showModal = false
      state.header = ""
      state.body = ""
    },
    setModelDetails(state, { header, body }) {
      state.header = header
      state.body = body
    },
  },
}
