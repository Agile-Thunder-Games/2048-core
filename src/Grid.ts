class Grid {
    private _size: number;
    private _cells: any[];
    private _previousState: number[];

    public constructor(size: number, previousState?: number[]) {
        this.size = size;
        this.cells = previousState ? this.fromState(previousState) : this.empty();
    }

    public empty(): number[] {
        let cells: any[] = [];

        for (let x: number = 0; x < this.size; x++) {
            let row: number[] = cells[x] = [];

            for (let y: number = 0; y < this.size; y++) {
                row.push(null);
            }
        }

        return cells;
    }

    public fromState(state: any[]): number[] {
        let cells: any[] = [];

        for (let x: number = 0; x < this.size; x++) {
            let row: any[] = cells[x] = [];

            for (let y: number = 0; y < this.size; y++) {
                let tile: Tile = state[x][y];
                
                row.push(tile ? new Tile(tile.position, tile.value) : null);
            }
        }

        return cells;
    }

    public randomAvailableCell(): Point {
        let cells: Point[] = this.availableCells();

        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }

    public availableCells(): Point[] {
        let cells: Point[] = [];

        this.eachCell((x: number, y: number, tile: Tile) => {
            if (!tile) {
                cells.push({
                    x: x, 
                    y: y
                });
            }
        });

        return cells;
    }

    public eachCell(callback: any): void {
        for (let x: number = 0; x < this.size; x++) {
            for (let y: number = 0; y < this.size; y++) {
                callback(x, y, this.cells[x][y]);
            }
        }
    }

    public cellsAvailable(): boolean {
        return !!this.availableCells().length;
    }

    public cellAvailable(cell: Point): boolean {
        return !this.cellOccupied(cell);
    }
    
    public cellOccupied(cell: Point): boolean {
        return !!this.cellContent(cell);
    }

    public cellContent(cell: Point): Tile {
        if (this.withinBounds(cell)) {
            return this.cells[cell.x][cell.y];
        } else {
            return null;
        }
    }

    public insertTile(tile: Tile): void {
         this.cells[tile.x][tile.y] = tile;
    }

    public removeTile(tile: Tile): void {
        this.cells[tile.x][tile.y] = null;
    }

    public withinBounds(position: Point): boolean {
        return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
    }

    public serialize(): Object {
        let cellState: Object[] = [];

        for (let x: number = 0; x < this.size; x++) {
            let row : any[] = cellState[x] = [];

            for (let y: number = 0; y < this.size; y++) {
                row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
            }
        }

        return {
            size: this.size,
            cells: cellState
        };
    }

    /*
        Getters and setters
    */
    public get size() : number {
        return this._size;
    }
    
    public set size(size : number) {
        this._size = size;
    }

    public get cells(): any[] {
        return this._cells;
    }
    
    public set cells(cells: any[]) {
        this._cells = cells;
    }

    public get previousState() : number[] {
        return this._previousState;
    }
    
    public set previousState(state: number[]) {
        this._previousState = state;
    }
}