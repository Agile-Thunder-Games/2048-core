import {KeyboardInputManager} from "./KeyboardInputManager"
import {LocalStorageManager} from "./LocalStorageManager"
import {HtmlActuator} from "./HtmlActuator"
import {Game} from "./Game"

let size: number = 4;
let inputManager: KeyboardInputManager = new KeyboardInputManager();
let storageManager: LocalStorageManager = new LocalStorageManager();
let actuator: HtmlActuator = new HtmlActuator();

function createGame(): void {
    let game: Game = new Game(size, inputManager, storageManager, actuator);

    console.log(game);

    game.run();
}

window.requestAnimationFrame(createGame);