System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LocalStorageManager;
    return {
        setters: [],
        execute: function () {
            LocalStorageManager = (function () {
                function LocalStorageManager() {
                    this.bestScoreKey = "bestScore";
                    this.gameStateKey = "gameState";
                    this.storage = window.localStorage;
                }
                LocalStorageManager.prototype.clearGameState = function () {
                    this.storage.removeItem(this.gameStateKey);
                };
                Object.defineProperty(LocalStorageManager.prototype, "bestScore", {
                    get: function () {
                        return this.storage.getItem(this.bestScoreKey) || 0;
                    },
                    set: function (value) {
                        this.storage.setItem(this.bestScoreKey, value.toString());
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LocalStorageManager.prototype, "gameState", {
                    get: function () {
                        var stateJSON = this.storage.getItem(this.gameStateKey);
                        if (stateJSON) {
                            return JSON.parse(stateJSON);
                        }
                        else {
                            return null;
                        }
                    },
                    set: function (value) {
                        this.storage.setItem(this.gameStateKey, JSON.stringify(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                return LocalStorageManager;
            }());
            exports_1("LocalStorageManager", LocalStorageManager);
        }
    };
});
