import { Modal, ModalStore } from "../../shared/interfaces";

const state: ModalStore = {
  showModal: false,
  header: "",
  body: "",
}

export default {
  namespaced: true,
  state,
  mutations: {
    closeModal(state: ModalStore) {
      state.header = ""
      state.body = ""
      state.showModal = false
    },
    setAndShowModal(state: ModalStore, modal: Modal) {
      const { header, body } = modal
      state.header = header
      state.body = body
      state.showModal = true
    },
  }
}
