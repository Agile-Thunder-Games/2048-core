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
            Game = class Game {
                constructor(size, inputManager, storageManager, actuator) {
                    this.size = size;
                    this.inputManager = inputManager;
                    this.storageManager = storageManager;
                    this.actuator = actuator;
                    this.startTiles = 2;
                    this.run();
                }
                run() {
                    this.inputManager.on("move", this.move.bind(this));
                    this.inputManager.on("restart", this.restart.bind(this));
                    this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));
                    this.setup();
                }
                restart() {
                    this.storageManager.clearGameState();
                    this.actuator.continueGame();
                    this.setup();
                }
                keepPlaying() {
                    this.isPlaying = true;
                    this.actuator.continueGame();
                }
                get isGameTerminated() {
                    return this.over || (this.won && !this.isPlaying);
                }
                setup() {
                    let previousState = this.storageManager.gameState;
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
                }
                addStartTiles() {
                    for (let i = 0; i < this.startTiles; i++) {
                        this.addRandomTile();
                    }
                }
                addRandomTile() {
                    if (this.grid.isCellsAvailable()) {
                        let value;
                        if (Math.random() < 0.9) {
                            value = 2;
                        }
                        else {
                            value = 4;
                        }
                        let tile = new Tile_1.Tile(this.grid.randomAvailableCell(), value);
                        this.grid.insertTile(tile);
                    }
                }
                actuate() {
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
                }
                serialize() {
                    return {
                        grid: this.grid.serialize(),
                        score: this.score,
                        over: this.over,
                        won: this.won,
                        keepPlaying: this.keepPlaying
                    };
                }
                prepareTiles() {
                    this.grid.eachCell((x, y, tile) => {
                        if (tile) {
                            tile.mergedFrom = null;
                            tile.savePosition();
                        }
                    });
                }
                moveTile(tile, cell) {
                    this.grid.cells[tile.x][tile.y] = null;
                    this.grid.cells[cell.x][cell.y] = tile;
                    tile.updatePosition(cell);
                }
                move(direction) {
                    if (this.isGameTerminated) {
                        return;
                    }
                    let cell;
                    let tile;
                    let vector = this.getVector(direction);
                    let traversals = this.buildTraversals(vector);
                    let moved = false;
                    this.prepareTiles();
                    for (let x of traversals.x) {
                        for (let y of traversals.y) {
                            cell = {
                                x: x,
                                y: y
                            };
                            tile = this.grid.cellContent(cell);
                            if (tile) {
                                let positions = this.findFarthestPosition(cell, vector);
                                let next = this.grid.cellContent(positions.next);
                                if (next && next.value === tile.value && !next.mergedFrom) {
                                    let merged = new Tile_1.Tile(positions.next, tile.value * 2);
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
                }
                getVector(direction) {
                    const directions = [
                        { x: 0, y: -1 },
                        { x: 1, y: 0 },
                        { x: 0, y: 1 },
                        { x: -1, y: 0 },
                    ];
                    return directions[direction];
                }
                buildTraversals(vector) {
                    let traversals = {
                        x: [],
                        y: [],
                    };
                    for (let pos = 0; pos < this.size; pos++) {
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
                }
                findFarthestPosition(cell, vector) {
                    let previous;
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
                }
                isMovesAvailable() {
                    return this.grid.isCellsAvailable() || this.isTileMatchesAvailable();
                }
                isTileMatchesAvailable() {
                    let tile;
                    for (let x = 0; x < this.size; x++) {
                        for (let y = 0; y < this.size; y++) {
                            tile = this.grid.cellContent({
                                x: x,
                                y: y,
                            });
                            if (tile) {
                                for (let direction = 0; direction < 4; direction++) {
                                    let vector = this.getVector(direction);
                                    let cell = {
                                        x: x + vector.x,
                                        y: y + vector.y
                                    };
                                    let other = this.grid.cellContent(cell);
                                    if (other && other.value === tile.value) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                }
                positionsEquals(first, second) {
                    return (first.x === second.x) && (first.y === second.y);
                }
            };
            exports_1("Game", Game);
        }
    };
});
