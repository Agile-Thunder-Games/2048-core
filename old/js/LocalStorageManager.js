System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LocalStorageManager;
    return {
        setters: [],
        execute: function () {
            LocalStorageManager = class LocalStorageManager {
                constructor() {
                    this.bestScoreKey = "bestScore";
                    this.gameStateKey = "gameState";
                    this.storage = window.localStorage;
                }
                clearGameState() {
                    this.storage.removeItem(this.gameStateKey);
                }
                get bestScore() {
                    return this.storage.getItem(this.bestScoreKey) || 0;
                }
                set bestScore(value) {
                    this.storage.setItem(this.bestScoreKey, value.toString());
                }
                get gameState() {
                    let stateJSON = this.storage.getItem(this.gameStateKey);
                    if (stateJSON) {
                        return JSON.parse(stateJSON);
                    }
                    else {
                        return null;
                    }
                }
                set gameState(value) {
                    this.storage.setItem(this.gameStateKey, JSON.stringify(value));
                }
            };
            exports_1("LocalStorageManager", LocalStorageManager);
        }
    };
});
