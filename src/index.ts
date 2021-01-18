import "./css/game.css";
import './css/game-mobile.css';

import Game from "./modules/game";
import HtmlActuator from "./modules/htmlActuator";
import KeyboardInputManager from "./modules/keyboardInputManager";
import LocalStorageManager from "./modules/localStorageManager";

const size: number = 4;
const inputManager: KeyboardInputManager = new KeyboardInputManager();
const storageManager: LocalStorageManager = new LocalStorageManager();
const actuator: HtmlActuator = new HtmlActuator();

window.requestAnimationFrame(() : void => {
    const game  = new Game(size, inputManager, storageManager, actuator);

    game.run();
});