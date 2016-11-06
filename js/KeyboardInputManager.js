System.register(["./Direction"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Direction_1, KeyboardInputManager;
    return {
        setters: [
            function (Direction_1_1) {
                Direction_1 = Direction_1_1;
            }
        ],
        execute: function () {
            KeyboardInputManager = (function () {
                function KeyboardInputManager() {
                    this.events = [];
                    if (window.navigator.msPointerEnabled) {
                        this.eventTouchStart = "MSPointerDown";
                        this.eventTouchMove = "MSPointerMove";
                        this.eventTouchEnd = "MSPointerUp";
                    }
                    else {
                        this.eventTouchStart = "touchstart";
                        this.eventTouchMove = "touchmove";
                        this.eventTouchEnd = "touchend";
                    }
                    this.listen();
                }
                KeyboardInputManager.prototype.on = function (event, callback) {
                    if (!this.events[event]) {
                        this.events[event] = [];
                    }
                    this.events[event].push(callback);
                };
                KeyboardInputManager.prototype.emit = function (event, data) {
                    var callbacks = this.events[event];
                    if (callbacks) {
                        for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                            var callback = callbacks_1[_i];
                            callback(data);
                        }
                    }
                };
                KeyboardInputManager.prototype.listen = function () {
                    var _this = this;
                    document.addEventListener("keydown", function (event) {
                        var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
                        var mapped;
                        if (!modifiers) {
                            switch (event.keyCode) {
                                case 37:
                                    mapped = Direction_1.Direction.Left;
                                    break;
                                case 38:
                                    mapped = Direction_1.Direction.Up;
                                    break;
                                case 39:
                                    mapped = Direction_1.Direction.Right;
                                    break;
                                case 40:
                                    mapped = Direction_1.Direction.Down;
                                    break;
                            }
                        }
                        if (typeof mapped !== undefined) {
                            event.preventDefault();
                            _this.emit("move", mapped);
                        }
                    });
                    this.bindButtonPress(".retry-button", this.restart);
                    this.bindButtonPress(".restart-button", this.restart);
                    this.bindButtonPress(".keep-playing-button", this.keepPlaying);
                    var touchStartClientX;
                    var touchStartClientY;
                    var gameContainer = document.querySelector(".game-container");
                    gameContainer.addEventListener(this.eventTouchStart, function (event) {
                        if (window.navigator.msPointerEnabled) {
                            touchStartClientX = event.pageX;
                            touchStartClientY = event.pageY;
                        }
                        else {
                            touchStartClientX = event.touches[0].clientX;
                            touchStartClientY = event.touches[0].clientY;
                        }
                        event.preventDefault();
                    });
                    gameContainer.addEventListener(this.eventTouchMove, function (event) { return event.preventDefault(); });
                    gameContainer.addEventListener(this.eventTouchEnd, function (event) {
                        var touchEndClientX;
                        var touchEndClientY;
                        if (window.navigator.msPointerEnabled) {
                            touchEndClientX = event.pageX;
                            touchEndClientY = event.pageY;
                        }
                        else {
                            touchEndClientX = event.changedTouches[0].clientX;
                            touchEndClientY = event.changedTouches[0].clientY;
                        }
                        var dx = touchEndClientX - touchStartClientX;
                        var absDx = Math.abs(dx);
                        var dy = touchEndClientY - touchStartClientY;
                        var absDy = Math.abs(dy);
                        if (Math.max(absDx, absDy) > 10) {
                            _this.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
                        }
                    });
                };
                KeyboardInputManager.prototype.restart = function (event) {
                    event.preventDefault();
                    this.emit("restart", null);
                };
                KeyboardInputManager.prototype.keepPlaying = function (event) {
                    event.preventDefault();
                    this.emit("keepPlaying", null);
                };
                KeyboardInputManager.prototype.bindButtonPress = function (selector, fn) {
                    var button = document.querySelector(selector);
                    button.addEventListener("click", fn.bind(this));
                    button.addEventListener(this.eventTouchEnd, fn.bind(this));
                };
                return KeyboardInputManager;
            }());
            exports_1("KeyboardInputManager", KeyboardInputManager);
        }
    };
});
