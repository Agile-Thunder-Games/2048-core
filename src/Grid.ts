import {Tile} from "./Tile"

export class Grid {
    /*private _size: number;
    private _cells: Tile[];
    private _previousState: Tile[][];*/

    public constructor(size: number, previousState: Tile[][]) {
        this.size = size;
        //this.cells = previousState ? this.fromState(previousState) : this.empty();

        if(previousState) {
            this.cells = this.fromState(previousState);

            console.log("Cells gets from state");
        } else {
            this.cells = this.empty();
            
            console.log("empty cells");
        }   
        /*} else {
            console.log(this.empty());
        }*/

        console.log(this.empty());
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

    /*
    // !!!!!!!!!! THIS IS NEW CODE BUT DONT WORK
    public fromState(state: Tile[][]): number[] {
        let cells: any[] = [];

        for (let x: number = 0; x < this.size; x++) {
            let row: Tile[] = cells[x] = [];

            for (let y: number = 0; y < this.size; y++) {
                let tile: Tile = state[x][y];
                    
                row.push(tile ? new Tile(tile.position, tile.value) : null);
            }
        }

        return cells;
    }*/

    public fromState(state: Tile[][]): number[] {
        let cells: any[] = [];

        for (var x: number = 0; x < this.size; x++) {
            let row: Tile[] = cells[x] = []; // any

            for (let y: number = 0; y < this.size; y++) {
                let tile: Tile = state[x][y];
                
                //row.push(tile ? new Tile(tile.position, tile.value) : null);

                if (tile) {
                    row.push(new Tile(tile.position, tile.value));
                } else {
                    row.push(null);
                }
            }
        }

        return cells;
    }

    public randomAvailableCell(): IPosition {
        let cells: IPosition[] = this.availableCells();

        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }

    public availableCells(): IPosition[] {
        let cells: IPosition[] = [];

        this.eachCell((x: number, y: number, tile: Tile): void => {
            if (!tile) {
                cells.push({
                    x: x,
                    y: y,
                });
            }
        });

        return cells;
    }

    public eachCell(callback: (x: number, y: number, cells: Tile) => void): void {
        for (let x: number = 0; x < this.size; x++) {
            for (let y: number = 0; y < this.size; y++) {
                callback(x, y, this.cells[x][y]);
            }
        }
    }

    // #region ForOptimization
    public cellsAvailable(): boolean {
        return !!this.availableCells().length;
    }

    public cellAvailable(cell: IPosition): boolean {
        return !this.cellOccupied(cell);
    }
        
    public cellOccupied(cell: IPosition): boolean {
        return !!this.cellContent(cell);
    }

    public cellContent(cell: IPosition): Tile {
        if (this.withinBounds(cell)) {
            return this.cells[cell.x][cell.y];
        } else {
            return null;
        }
    }
    // #endregion
    
    public insertTile(tile: Tile): void {
        this.cells[tile.x][tile.y] = tile;
    }

    public removeTile(tile: Tile): void {
        this.cells[tile.x][tile.y] = null;
    }

    public withinBounds(position: IPosition): boolean {
        console.log("withinBounds called");
        return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
    }

    public serialize(): any {
        let cellState: any[] = [];

        for (let x: number = 0; x < this.size; x++) {
            let row : any[] = cellState[x] = [];

            for (let y: number = 0; y < this.size; y++) {
                //row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);

                if(this.cells[x][y]) {
                    row.push(this.cells[x][y].serialize());
                } else {
                    row.push(null);
                }
            }
        }

        return {
            size: this.size,
            cells: cellState
        };
    }

    public get size() : number {
        return this.size;
    }
        
    public set size(value : number) {
        this.size = value;
    }

    public get cells(): any[] {
        return this.cells;
    }
        
    public set cells(value : any[]) {
        this.cells = value;
    }

    public get previousState() : Tile[][] {
        return this.previousState;
    }

    public set previousState(value : Tile[][]) {
        this.previousState = value;
    }
}