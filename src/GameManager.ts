class GameManager {
    private size: number;
    private inputManager: KeyboardInputManager;
    private storageManager: LocalStorageManager;
    private actuator: HTMLActuator;
    private startTiles: number;
    private over: boolean;
    private won: boolean;
    private _keepPlaying: boolean;
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
        this._keepPlaying = true;
        this.actuator.continueGame(); // Clear the game won/lost message
    }

    // Return true if the game is lost, or has won and the user hasn't kept playing
    public isGameTerminated() {
        return this.over || (this.won && !this._keepPlaying);
    }

    public setup() {
        var previousState = this.storageManager.getGameState();

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
            this._keepPlaying = false;
            this.addStartTiles();
        }

        this.actuate();
    }

    public addStartTiles(): void {
        for (var i = 0; i < this.startTiles; i++) {
            this.addRandomTile();
        }
    }

    public addRandomTile(): void {
        if (this.grid.cellsAvailable()) {
            var value: number = Math.random() < 0.9 ? 2 : 4;
            var tile: Tile = new Tile(this.grid.randomAvailableCell(), value);

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

    moveTile(tile: Tile, cell: Position): void {
        this.grid.cells[tile.x][tile.y] = null;
        this.grid.cells[cell.x][cell.y] = tile;
  
        tile.updatePosition(cell);
    }

    public move(direction: string) {
        // 0: up, 1: right, 2: down, 3: left
        var self = this;

        if (this.isGameTerminated()) return; // Don't do anything if the game's over

        var cell: any;
        var tile: Tile;

        var vector: GameManager = this.getVector(direction);
        var traversals: any = this.buildTraversals(vector);
        var moved: boolean = false;

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
                    var positions = self.findFarthestPosition(cell, vector);
                    var next = self.grid.cellContent(positions.next);

                    // Only one merger per row traversal?
                    if (next && next.value === tile.value && !next.mergedFrom) {
                        var merged = new Tile(positions.next, tile.value * 2);
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

    public getVector(direction: any): any {
        var map : any = {
            0: { x: 0,  y: -1 }, // Up
            1: { x: 1,  y: 0 },  // Right
            2: { x: 0,  y: 1 },  // Down
            3: { x: -1, y: 0 }   // Left
        };

        return map[direction];
    }

   public buildTraversals(vector: any): any {
        var traversals: any = { x: [], y: [] };

        for (var pos = 0; pos < this.size; pos++) {
            traversals.x.push(pos);
            traversals.y.push(pos);
        }

        // Always traverse from the farthest cell in the chosen direction
        if (vector.x === 1) traversals.x = traversals.x.reverse();
        if (vector.y === 1) traversals.y = traversals.y.reverse();

        return traversals;
    }

    public findFarthestPosition(cell: any, vector: any): any {
        var previous: any;

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
        var self = this;
        var tile: Tile;

        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                tile = this.grid.cellContent({ x: x, y: y });

                if (tile) {
                    for (var direction = 0; direction < 4; direction++) {
                        var vector = self.getVector(direction);
                        var cell   = { x: x + vector.x, y: y + vector.y };

                        var other  = self.grid.cellContent(cell);

                        if (other && other.value === tile.value) {
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    public positionsEqual(first: any, second: any): boolean {
        return first.x === second.x && first.y === second.y;
    };
}