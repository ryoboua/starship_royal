import { Modal, ModalStore } from "../../interfaces";

const initState: ModalStore = {
  showModal: false,
  header: "",
  body: "",
}

export default {
  namespaced: true,
  state: initState,
  mutations: {
    closeModal(state: ModalStore) {
      state.header = ""
      state.body = ""
      state.showModal = false
    },
    setAndShowModal(state: ModalStore, { header, body }: Modal) {
      state.header = header
      state.body = body
      state.showModal = true
    },
  },
  actions: {}
}
