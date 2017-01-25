var Tile = (function () {
    function Tile(position, value) {
        this.x = position.x;
        this.y = position.y;
        this.value = value || 2;
        this.previousPosition = null;
        this.mergedFrom = null;
    }
    Tile.prototype.savePosition = function () {
        this.previousPosition = {
            x: this.x,
            y: this.y
        };
    };
    Tile.prototype.updatePosition = function (position) {
        this.x = position.x;
        this.y = position.y;
    };
    Tile.prototype.serialize = function () {
        return {
            position: {
                x: this.x,
                y: this.y
            },
            value: this.value
        };
    };
    Object.defineProperty(Tile.prototype, "position", {
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "previousPosition", {
        get: function () {
            return this._previousPosition;
        },
        set: function (value) {
            this._previousPosition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tile.prototype, "mergedFrom", {
        get: function () {
            return this._mergedFrom;
        },
        set: function (value) {
            this._mergedFrom = value;
        },
        enumerable: true,
        configurable: true
    });
    return Tile;
}());
export { Tile };
//# sourceMappingURL=Tile.js.map