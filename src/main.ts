import {KeyboardInputManager} from "./KeyboardInputManager";
import {LocalStorageManager} from "./LocalStorageManager";
import {HtmlActuator} from "./HtmlActuator";
import {Game} from "./Game";

let size: number = 4;
let inputManager: KeyboardInputManager = new KeyboardInputManager();
let storageManager: LocalStorageManager = new LocalStorageManager();
let actuator: HtmlActuator = new HtmlActuator();

//window.requestAnimationFrame((): Game => new Game(size, inputManager, storageManager, actuator));

new Game(size, inputManager, storageManager, actuator);
