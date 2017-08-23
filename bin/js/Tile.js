System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Tile;
    return {
        setters: [],
        execute: function () {
            Tile = class Tile {
                constructor(position, value) {
                    this.x = position.x;
                    this.y = position.y;
                    this.value = value || 2;
                    this.previousPosition = null;
                    this.mergedFrom = null;
                }
                savePosition() {
                    this.previousPosition = {
                        x: this.x,
                        y: this.y,
                    };
                }
                updatePosition(position) {
                    this.x = position.x;
                    this.y = position.y;
                }
                serialize() {
                    return {
                        position: {
                            x: this.x,
                            y: this.y
                        },
                        value: this.value
                    };
                }
                get position() {
                    return this._position;
                }
                set position(value) {
                    this._position = value;
                }
                get value() {
                    return this._value;
                }
                set value(value) {
                    this._value = value;
                }
                get previousPosition() {
                    return this._previousPosition;
                }
                set previousPosition(value) {
                    this._previousPosition = value;
                }
                get x() {
                    return this._x;
                }
                set x(value) {
                    this._x = value;
                }
                get y() {
                    return this._y;
                }
                set y(value) {
                    this._y = value;
                }
                get mergedFrom() {
                    return this._mergedFrom;
                }
                set mergedFrom(value) {
                    this._mergedFrom = value;
                }
            };
            exports_1("Tile", Tile);
        }
    };
});
