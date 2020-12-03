import { KeysModel, KeyCodes } from "../../shared/interfaces"

const {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Space,
  KeyA,
  KeyW,
  KeyD,
  KeyS
} = KeyCodes

export default class Keys implements KeysModel {
  public up: boolean
  public down: boolean
  public left: boolean
  public right: boolean
  public spacebar: boolean

  constructor() {
    this.up = false
    this.down = false
    this.left = false
    this.right = false
    this.spacebar = false
  }

  updateKeysDown(keyCode: KeyCodes) {
    if (!keyCode) {
      return
    }
    if (keyCode === ArrowLeft || keyCode === KeyA) {
      this.left = true
    }
    if (keyCode === ArrowDown || keyCode === KeyS) {
      this.down = true
    }
    if (keyCode === ArrowRight || keyCode === KeyD) {
      this.right = true
    }
    if (keyCode === ArrowUp || keyCode === KeyW) {
      this.up = true
    }
    if (keyCode === Space) {
      this.spacebar = true
    }
  }

  updateKeysUp(keyCode: KeyCodes) {
    if (!keyCode) {
      return
    }
    if (keyCode === ArrowLeft || keyCode === KeyA) {
      this.left = false
    }
    if (keyCode === ArrowDown || keyCode === KeyS) {
      this.down = false
    }
    if (keyCode === ArrowRight || keyCode === KeyD) {
      this.right = false
    }
    if (keyCode === ArrowUp || keyCode === KeyW) {
      this.up = false
    }
    if (keyCode === Space) {
      this.spacebar = false
    }
  }
}
