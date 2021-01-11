System.register(["./KeyboardInputManager", "./LocalStorageManager", "./HtmlActuator", "./Game"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var KeyboardInputManager_1, LocalStorageManager_1, HtmlActuator_1, Game_1, size, inputManager, storageManager, actuator;
    return {
        setters: [
            function (KeyboardInputManager_1_1) {
                KeyboardInputManager_1 = KeyboardInputManager_1_1;
            },
            function (LocalStorageManager_1_1) {
                LocalStorageManager_1 = LocalStorageManager_1_1;
            },
            function (HtmlActuator_1_1) {
                HtmlActuator_1 = HtmlActuator_1_1;
            },
            function (Game_1_1) {
                Game_1 = Game_1_1;
            }
        ],
        execute: function () {
            size = 4;
            inputManager = new KeyboardInputManager_1.KeyboardInputManager();
            storageManager = new LocalStorageManager_1.LocalStorageManager();
            actuator = new HtmlActuator_1.HtmlActuator();
            new Game_1.Game(size, inputManager, storageManager, actuator);
        }
    };
});
