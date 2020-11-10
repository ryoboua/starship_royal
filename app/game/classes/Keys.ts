import { KeysModel } from "../../shared/interfaces"

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

  updateKeysDown(keyCode: number) {
    if (!keyCode) {
      return
    }
    if (keyCode === 37 || keyCode === 65) {
      this.left = true
    }
    if (keyCode === 38 || keyCode === 87) {
      this.down = true
    }
    if (keyCode === 39 || keyCode === 68) {
      this.right = true
    }
    if (keyCode === 40 || keyCode === 83) {
      this.up = true
    }
    if (keyCode === 32) {
      this.spacebar = true
    }
  }

  updateKeysUp(keyCode: number) {
    if (!keyCode) {
      return
    }
    if (keyCode === 37 || keyCode === 65) {
      this.left = false
    }
    if (keyCode === 38 || keyCode === 87) {
      this.down = false
    }
    if (keyCode === 39 || keyCode === 68) {
      this.right = false
    }
    if (keyCode === 40 || keyCode === 83) {
      this.up = false
    }
    if (keyCode === 32) {
      this.spacebar = false
    }
  }
}
