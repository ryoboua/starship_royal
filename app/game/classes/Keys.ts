import { KeysModel } from "../../interfaces"


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
    // left
    if (keyCode === 37 || keyCode === 65) {
      this.left = true
    }
    // down
    if (keyCode === 38 || keyCode === 87) {
      this.down = true
    }
    // right
    if (keyCode === 39 || keyCode === 68) {
      this.right = true
    }
    // up
    if (keyCode === 40 || keyCode === 83) {
      this.up = true
    }
    // spacebar
    if (keyCode === 32) {
      this.spacebar = true
    }
  }

  updateKeysUp(keyCode: number) {
    if (!keyCode) {
      return
    }
    // left
    if (keyCode === 37 || keyCode === 65) {
      this.left = false
    }
    // down
    if (keyCode === 38 || keyCode === 87) {
      this.down = false
    }
    // right
    if (keyCode === 39 || keyCode === 68) {
      this.right = false
    }
    // up
    if (keyCode === 40 || keyCode === 83) {
      this.up = false
    }
    // spacebar
    if (keyCode === 32) {
      this.spacebar = false
    }
  }
}
