class Game {
    private size: number;
    private inputManager: KeyboardInputManager;
    private storageManager: LocalStorageManager;
    private actuator: HTMLActuator;
    private startTiles: number;
    private over: boolean;
    private won: boolean;
    private isPlaying: boolean;
    private grid: Grid;
    private score: number;

    public constructor(size: number, InputManager: any, Actuator: any, StorageManager: any) {
        this.size = size;
        this.inputManager = new InputManager;
        this.storageManager = new StorageManager;
        this.actuator = new Actuator;

        this.startTiles  = 2;

        this.inputManager.on("move", this.move.bind(this));
        this.inputManager.on("restart", this.restart.bind(this));
        this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

        this.setup();
    }

    public restart() {
        this.storageManager.clearGameState();
        this.actuator.continueGame(); // Clear the game won/lost message
        this.setup();
    }

    public keepPlaying() {
        this.isPlaying = true;
        this.actuator.continueGame(); // Clear the game won/lost message
    }

    // Return true if the game is lost, or has won and the user hasn't kept playing
    public isGameTerminated() {
        return this.over || (this.won && !this.isPlaying);
    }

    public setup() {
        let previousState: any = this.storageManager.getGameState();

        if (previousState) {
            this.grid = new Grid(previousState.grid.size, previousState.grid.cells);
            this.score = previousState.score;
            this.over = previousState.over;
            this.won = previousState.won;
            this.keepPlaying = previousState.keepPlaying;
        } else {
            this.grid = new Grid(this.size);
            this.score = 0;
            this.over = false;
            this.won = false;
            this.isPlaying = false;
            this.addStartTiles();
        }

        this.actuate();
    }

    public addStartTiles(): void {
        for (let i: number = 0; i < this.startTiles; i++) {
            this.addRandomTile();
        }
    }

    public addRandomTile(): void {
        if (this.grid.cellsAvailable()) {
            let value: number = Math.random() < 0.9 ? 2 : 4;
            let tile: Tile = new Tile(this.grid.randomAvailableCell(), value);

            this.grid.insertTile(tile);
        }
    }

    public actuate(): void {
        if (this.storageManager.getBestScore() < this.score) {
            this.storageManager.setBestScore(this.score);
        }

        if (this.over) {
            this.storageManager.clearGameState();
        } else {
            this.storageManager.setGameState(this.serialize());
        }

        this.actuator.actuate(this.grid, {
            score: this.score,
            over: this.over,
            won: this.won,
            bestScore: this.storageManager.getBestScore(),
            terminated: this.isGameTerminated()
        });
    }

    public serialize(): any {
        return {
            grid: this.grid.serialize(),
            score: this.score,
            over: this.over,
            won: this.won,
            keepPlaying: this.keepPlaying
        };
    }

    public prepareTiles(): void {
        this.grid.eachCell(function (x: number, y: number, tile: Tile) {
            if (tile) {
                tile.mergedFrom = null;
                tile.savePosition();
            }
        });
    }

    public moveTile(tile: Tile, cell: Point): void {
        this.grid.cells[tile.x][tile.y] = null;
        this.grid.cells[cell.x][cell.y] = tile;
  
        tile.updatePosition(cell);
    }

    public move(direction: number): void {
        // 0: up, 1: right, 2: down, 3: left
        let self: Game = this;

        if (this.isGameTerminated()) return; // Don't do anything if the game's over

        let cell: Point;
        let tile: Tile;

        let vector: Point = this.getVector(direction);
        let traversals: any = this.buildTraversals(vector);
        let moved: boolean = false;

        // Save the current tile positions and remove merger information
        this.prepareTiles();

        // Traverse the grid in the right direction and move tiles
        traversals.x.forEach(function (x: number) {
            traversals.y.forEach(function (y: number) {
                cell = { 
                    x: x, 
                    y: y
                };
                tile = self.grid.cellContent(cell);

                if (tile) {
                    let positions: any = self.findFarthestPosition(cell, vector);
                    let next: Tile = self.grid.cellContent(positions.next);

                    // Only one merger per row traversal?
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        let merged: Tile = new Tile(positions.next, tile.value * 2);

                        merged.mergedFrom = [tile, next];

                        self.grid.insertTile(merged);
                        self.grid.removeTile(tile);

                        tile.updatePosition(positions.next);
                        self.score += merged.value;

                        if (merged.value === 2048) self.won = true;
                    } else {
                        self.moveTile(tile, positions.farthest);
                    }

                    if (!self.positionsEqual(cell, tile)) {
                        moved = true; // The tile moved from its original cell!
                    }
                }
            });
        });

        if (moved) {
            this.addRandomTile();

            if (!this.movesAvailable()) {
                this.over = true; // Game over!
            }

            this.actuate();
        }
    }

    public getVector(direction: number): any {
        let map: any = {
            0: { x: 0,  y: -1 }, // Up
            1: { x: 1,  y: 0 },  // Right
            2: { x: 0,  y: 1 },  // Down
            3: { x: -1, y: 0 }   // Left
        };

        return map[direction];
    }

   public buildTraversals(vector: Point): Object {
        let traversals: any = { 
            x: [], 
            y: [] 
        };

        for (let pos: number = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        // Always traverse from the farthest cell in the chosen direction
        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();

        return traversals;
    }

    public findFarthestPosition(cell: Point, vector: Point): Object {
        let previous: Point;

        do {
            previous = cell;
            cell = { 
                x: previous.x + vector.x, 
                y: previous.y + vector.y
            };
        } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell));

        return {
            farthest: previous,
            next: cell
        };
    }

    public movesAvailable(): boolean {
        return this.grid.cellsAvailable() || this.tileMatchesAvailable();
    };

    public tileMatchesAvailable(): boolean {
        let self: Game = this;
        let tile: Tile;

        for (let x: number = 0; x < this.size; x++) {
            for (let y: number = 0; y < this.size; y++) {
                tile = this.grid.cellContent({ 
                    x: x, 
                    y: y 
                });

                if (tile) {
                    for (let direction: number = 0; direction < 4; direction++) {
                        let vector: Point = self.getVector(direction);
                        let cell: Point  = { 
                            x: x + vector.x, 
                            y: y + vector.y
                        };

                        let other: any = self.grid.cellContent(cell);

                        if (other && other.value === tile.value) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    public positionsEqual(first: Point, second: Point): boolean {
        return first.x === second.x && first.y === second.y;
    }
}