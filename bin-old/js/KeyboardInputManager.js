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
            KeyboardInputManager = class KeyboardInputManager {
                constructor() {
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
                on(event, callback) {
                    if (!this.events[event]) {
                        this.events[event] = [];
                    }
                    this.events[event].push(callback);
                }
                emit(event, data) {
                    let callbacks = this.events[event];
                    if (callbacks) {
                        for (let callback of callbacks) {
                            callback(data);
                        }
                    }
                }
                listen() {
                    document.addEventListener("keydown", (event) => {
                        let modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
                        let mapped;
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
                            this.emit("move", mapped);
                        }
                    });
                    this.bindButtonPress(".retry-button", this.restart);
                    this.bindButtonPress(".restart-button", this.restart);
                    this.bindButtonPress(".keep-playing-button", this.keepPlaying);
                    let touchStartClientX;
                    let touchStartClientY;
                    let gameContainer = document.querySelector(".game-container");
                    gameContainer.addEventListener(this.eventTouchStart, (event) => {
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
                    gameContainer.addEventListener(this.eventTouchMove, (event) => event.preventDefault());
                    gameContainer.addEventListener(this.eventTouchEnd, (event) => {
                        let touchEndClientX;
                        let touchEndClientY;
                        if (window.navigator.msPointerEnabled) {
                            touchEndClientX = event.pageX;
                            touchEndClientY = event.pageY;
                        }
                        else {
                            touchEndClientX = event.changedTouches[0].clientX;
                            touchEndClientY = event.changedTouches[0].clientY;
                        }
                        let dx = touchEndClientX - touchStartClientX;
                        let absDx = Math.abs(dx);
                        let dy = touchEndClientY - touchStartClientY;
                        let absDy = Math.abs(dy);
                        if (Math.max(absDx, absDy) > 10) {
                            this.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
                        }
                    });
                }
                restart(event) {
                    event.preventDefault();
                    this.emit("restart", null);
                }
                keepPlaying(event) {
                    event.preventDefault();
                    this.emit("keepPlaying", null);
                }
                bindButtonPress(selector, fn) {
                    let button = document.querySelector(selector);
                    button.addEventListener("click", fn.bind(this));
                    button.addEventListener(this.eventTouchEnd, fn.bind(this));
                }
            };
            exports_1("KeyboardInputManager", KeyboardInputManager);
        }
    };
});
