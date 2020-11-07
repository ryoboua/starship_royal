import { IKeys } from "./Interfaces";
export default class Keys implements IKeys {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    spacebar: boolean;
    constructor();
    updateKeysDown(keyCode: number): void;
    updateKeysUp(keyCode: number): void;
}
