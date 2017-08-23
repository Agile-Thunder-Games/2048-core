System.register(["./Tile"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Tile_1, Grid;
    return {
        setters: [
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            }
        ],
        execute: function () {
            Grid = class Grid {
                constructor(size, previousState) {
                    this.size = size;
                    if (previousState) {
                        this.cells = this.fromState(previousState);
                    }
                    else {
                        this.cells = this.empty();
                    }
                }
                empty() {
                    let cells = [];
                    for (let x = 0; x < this.size; x++) {
                        let row = cells[x] = [];
                        for (let y = 0; y < this.size; y++) {
                            row.push(null);
                        }
                    }
                    return cells;
                }
                fromState(state) {
                    let cells = [];
                    for (let x = 0; x < this.size; x++) {
                        let row = cells[x] = [];
                        for (let y = 0; y < this.size; y++) {
                            let tile = state[x][y];
                            if (tile) {
                                row.push(new Tile_1.Tile(tile.position, tile.value));
                            }
                            else {
                                row.push(null);
                            }
                        }
                    }
                    return cells;
                }
                randomAvailableCell() {
                    let cells = this.availableCells();
                    if (cells.length) {
                        return cells[Math.floor(Math.random() * cells.length)];
                    }
                }
                availableCells() {
                    let cells = [];
                    this.eachCell((x, y, tile) => {
                        if (!tile) {
                            cells.push({
                                x: x,
                                y: y,
                            });
                        }
                    });
                    return cells;
                }
                eachCell(callback) {
                    for (let x = 0; x < this.size; x++) {
                        for (let y = 0; y < this.size; y++) {
                            callback(x, y, this.cells[x][y]);
                        }
                    }
                }
                isCellsAvailable() {
                    if (this.availableCells().length) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                isCellAvailable(cell) {
                    if (!this.isCellOccupied(cell)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                isCellOccupied(cell) {
                    if (this.cellContent(cell)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                cellContent(cell) {
                    if (this.withinBounds(cell)) {
                        return this.cells[cell.x][cell.y];
                    }
                    else {
                        return null;
                    }
                }
                insertTile(tile) {
                    this.cells[tile.x][tile.y] = tile;
                }
                removeTile(tile) {
                    this.cells[tile.x][tile.y] = null;
                }
                withinBounds(position) {
                    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
                }
                serialize() {
                    let cellState = [];
                    for (let x = 0; x < this.size; x++) {
                        let row = cellState[x] = [];
                        for (let y = 0; y < this.size; y++) {
                            if (this.cells[x][y]) {
                                row.push(this.cells[x][y].serialize());
                            }
                            else {
                                row.push(null);
                            }
                        }
                    }
                    return {
                        size: this.size,
                        cells: cellState
                    };
                }
                get size() {
                    return this._size;
                }
                set size(value) {
                    this._size = value;
                }
                get cells() {
                    return this._cells;
                }
                set cells(value) {
                    this._cells = value;
                }
                get previousState() {
                    return this._previousState;
                }
                set previousState(value) {
                    this._previousState = value;
                }
            };
            exports_1("Grid", Grid);
        }
    };
});
