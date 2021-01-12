
import "./css/game.css";
import './css/game-mobile.css';

import Game from "./ts/Game";
import HtmlActuator from "./ts/HtmlActuator";
import KeyboardInputManager from "./ts/KeyboardInputManager";
import LocalStorageManager from "./ts/LocalStorageManager";

const size: number = 4;
const inputManager: KeyboardInputManager = new KeyboardInputManager();
const storageManager: LocalStorageManager = new LocalStorageManager();
const actuator: HtmlActuator = new HtmlActuator();

window.requestAnimationFrame(() : void => {
    const game  = new Game(size, inputManager, storageManager, actuator);

    game.run();
});