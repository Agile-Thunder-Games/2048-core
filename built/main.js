import { KeyboardInputManager } from "./KeyboardInputManager";
import { LocalStorageManager } from "./LocalStorageManager";
import { HtmlActuator } from "./HtmlActuator";
import { Game } from "./Game";
var size = 4;
var inputManager = new KeyboardInputManager();
var storageManager = new LocalStorageManager();
var actuator = new HtmlActuator();
new Game(size, inputManager, storageManager, actuator);
//# sourceMappingURL=main.js.map