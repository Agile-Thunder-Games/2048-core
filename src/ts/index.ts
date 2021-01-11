
import "../css/game.css";

import {KeyboardInputManager} from "./KeyboardInputManager";
import {LocalStorageManager} from "./LocalStorageManager";
import {HtmlActuator} from "./HtmlActuator";
import {Game} from "./Game";

const size: number = 4;
const inputManager: KeyboardInputManager = new KeyboardInputManager();
const storageManager: LocalStorageManager = new LocalStorageManager();
const actuator: HtmlActuator = new HtmlActuator();

//window.requestAnimationFrame((): Game => new Game(size, inputManager, storageManager, actuator));

const game  = new Game(size, inputManager, storageManager, actuator);

game.run();


