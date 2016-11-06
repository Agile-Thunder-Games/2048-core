System.register(["./Grid", "./Tile"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Grid_1, Tile_1, Game;
    return {
        setters: [
            function (Grid_1_1) {
                Grid_1 = Grid_1_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            }
        ],
        execute: function () {
            Game = (function () {
                function Game(size, inputManager, storageManager, actuator) {
                    this.size = size;
                    this.inputManager = inputManager;
                    this.storageManager = storageManager;
                    this.actuator = actuator;
                    this.startTiles = 2;
                    this.run();
                }
                Game.prototype.run = function () {
                    this.inputManager.on("move", this.move.bind(this));
                    this.inputManager.on("restart", this.restart.bind(this));
                    this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
                    this.setup();
                };
                Game.prototype.restart = function () {
                    this.storageManager.clearGameState();
                    this.actuator.continueGame();
                    this.setup();
                };
                Game.prototype.keepPlaying = function () {
                    this.isPlaying = true;
                    this.actuator.continueGame();
                };
                Object.defineProperty(Game.prototype, "isGameTerminated", {
                    get: function () {
                        return this.over || (this.won && !this.isPlaying);
                    },
                    enumerable: true,
                    configurable: true
                });
                Game.prototype.setup = function () {
                    var previousState = this.storageManager.gameState;
                    if (previousState) {
                        this.grid = new Grid_1.Grid(previousState.grid.size, previousState.grid.cells);
                        this.score = previousState.score;
                        this.over = previousState.over;
                        this.won = previousState.won;
                        this.keepPlaying = previousState.keepPlaying;
                    }
                    else {
                        this.grid = new Grid_1.Grid(this.size, null);
                        this.score = 0;
                        this.over = false;
                        this.won = false;
                        this.isPlaying = false;
                        this.addStartTiles();
                    }
                    this.actuate();
                };
                Game.prototype.addStartTiles = function () {
                    for (var i = 0; i < this.startTiles; i++) {
                        this.addRandomTile();
                    }
                };
                Game.prototype.addRandomTile = function () {
                    if (this.grid.isCellsAvailable()) {
                        var value = void 0;
                        if (Math.random() < 0.9) {
                            value = 2;
                        }
                        else {
                            value = 4;
                        }
                        var tile = new Tile_1.Tile(this.grid.randomAvailableCell(), value);
                        this.grid.insertTile(tile);
                    }
                };
                Game.prototype.actuate = function () {
                    if (this.storageManager.bestScore < this.score) {
                        this.storageManager.bestScore = this.score;
                    }
                    if (this.over) {
                        this.storageManager.clearGameState();
                    }
                    else {
                        this.storageManager.gameState = this.serialize();
                    }
                    this.actuator.actuate(this.grid, {
                        score: this.score,
                        over: this.over,
                        won: this.won,
                        bestScore: this.storageManager.bestScore,
                        terminated: this.isGameTerminated
                    });
                };
                Game.prototype.serialize = function () {
                    return {
                        grid: this.grid.serialize(),
                        score: this.score,
                        over: this.over,
                        won: this.won,
                        keepPlaying: this.keepPlaying
                    };
                };
                Game.prototype.prepareTiles = function () {
                    this.grid.eachCell(function (x, y, tile) {
                        if (tile) {
                            tile.mergedFrom = null;
                            tile.savePosition();
                        }
                    });
                };
                Game.prototype.moveTile = function (tile, cell) {
                    this.grid.cells[tile.x][tile.y] = null;
                    this.grid.cells[cell.x][cell.y] = tile;
                    tile.updatePosition(cell);
                };
                Game.prototype.move = function (direction) {
                    if (this.isGameTerminated) {
                        return;
                    }
                    var cell;
                    var tile;
                    var vector = this.getVector(direction);
                    var traversals = this.buildTraversals(vector);
                    var moved = false;
                    this.prepareTiles();
                    for (var _i = 0, _a = traversals.x; _i < _a.length; _i++) {
                        var x = _a[_i];
                        for (var _b = 0, _c = traversals.y; _b < _c.length; _b++) {
                            var y = _c[_b];
                            cell = {
                                x: x,
                                y: y
                            };
                            tile = this.grid.cellContent(cell);
                            if (tile) {
                                var positions = this.findFarthestPosition(cell, vector);
                                var next = this.grid.cellContent(positions.next);
                                if (next && next.value === tile.value && !next.mergedFrom) {
                                    var merged = new Tile_1.Tile(positions.next, tile.value * 2);
                                    merged.mergedFrom = [tile, next];
                                    this.grid.insertTile(merged);
                                    this.grid.removeTile(tile);
                                    tile.updatePosition(positions.next);
                                    this.score += merged.value;
                                    if (merged.value === 2048) {
                                        this.won = true;
                                    }
                                }
                                else {
                                    this.moveTile(tile, positions.farthest);
                                }
                                if (!this.positionsEquals(cell, tile)) {
                                    moved = true;
                                }
                            }
                        }
                    }
                    if (moved) {
                        this.addRandomTile();
                        if (!this.isMovesAvailable()) {
                            this.over = true;
                        }
                        this.actuate();
                    }
                };
                Game.prototype.getVector = function (direction) {
                    var directions = [
                        { x: 0, y: -1 },
                        { x: 1, y: 0 },
                        { x: 0, y: 1 },
                        { x: -1, y: 0 },
                    ];
                    return directions[direction];
                };
                Game.prototype.buildTraversals = function (vector) {
                    var traversals = {
                        x: [],
                        y: [],
                    };
                    for (var pos = 0; pos < this.size; pos++) {
                        traversals.x.push(pos);
                        traversals.y.push(pos);
                    }
                    if (vector.x === 1) {
                        traversals.x = traversals.x.reverse();
                    }
                    if (vector.y === 1) {
                        traversals.y = traversals.y.reverse();
                    }
                    return traversals;
                };
                Game.prototype.findFarthestPosition = function (cell, vector) {
                    var previous;
                    do {
                        previous = cell;
                        cell = {
                            x: previous.x + vector.x,
                            y: previous.y + vector.y
                        };
                    } while (this.grid.withinBounds(cell) && this.grid.isCellAvailable(cell));
                    return {
                        farthest: previous,
                        next: cell
                    };
                };
                Game.prototype.isMovesAvailable = function () {
                    return this.grid.isCellsAvailable() || this.isTileMatchesAvailable();
                };
                Game.prototype.isTileMatchesAvailable = function () {
                    var tile;
                    for (var x = 0; x < this.size; x++) {
                        for (var y = 0; y < this.size; y++) {
                            tile = this.grid.cellContent({
                                x: x,
                                y: y,
                            });
                            if (tile) {
                                for (var direction = 0; direction < 4; direction++) {
                                    var vector = this.getVector(direction);
                                    var cell = {
                                        x: x + vector.x,
                                        y: y + vector.y
                                    };
                                    var other = this.grid.cellContent(cell);
                                    if (other && other.value === tile.value) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                };
                Game.prototype.positionsEquals = function (first, second) {
                    return (first.x === second.x) && (first.y === second.y);
                };
                return Game;
            }());
            exports_1("Game", Game);
        }
    };
});
