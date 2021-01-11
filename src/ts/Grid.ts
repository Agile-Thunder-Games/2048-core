import { Tile } from "./Tile";

export class Grid {
    private _size: number;
    private _cells: Tile[];
    private _previousState: Tile[][];

    constructor(size: number, previousState: Tile[][]) {
        this.size = size;

        if (previousState) {
            this.cells = this.fromState(previousState);
        } else {
            this.cells = this.empty();
        }
    }

    empty(): number[] {
        let cells: any[] = [];

        for (let x: number = 0; x < this.size; x++) {
            let row: number[] = cells[x] = [];

            for (let y: number = 0; y < this.size; y++) {
                row.push(null);
            }
        }

        return cells;
    }

    fromState(state: Tile[][]): number[] {
        let cells: any[] = [];

        for (let x: number = 0; x < this.size; x++) {
            let row: Tile[] = cells[x] = [];

            for (let y: number = 0; y < this.size; y++) {
                let tile: Tile = state[x][y];
                
                if (tile) {
                    row.push(new Tile(tile.position, tile.value));
                } else {
                    row.push(null);
                }
            }
        }

        return cells;
    }

    randomAvailableCell(): IPosition {
        let cells: IPosition[] = this.availableCells();

        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }

    availableCells(): IPosition[] {
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

    eachCell(callback: (x: number, y: number, cells: Tile) => void): void {
        for (let x: number = 0; x < this.size; x++) {
            for (let y: number = 0; y < this.size; y++) {
                callback(x, y, this.cells[x][y]);
            }
        }
    }

    public isCellsAvailable(): boolean {
        if(this.availableCells().length) {
            return true;
        } else {
            return false;
        }
    }

    public isCellAvailable(cell: IPosition): boolean {
        if(!this.isCellOccupied(cell)) {
            return true;
        } else {
            return false;
        }
    }
        
    public isCellOccupied(cell: IPosition): boolean {
        if(this.cellContent(cell)) {
            return true;
        } else {
            return false;
        }
    }

    public cellContent(cell: IPosition): Tile {
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

    public withinBounds(position: IPosition): boolean {
        return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
    }

    public serialize(): any {
        let cellState: any[] = [];

        for (let x: number = 0; x < this.size; x++) {
            let row : any[] = cellState[x] = [];

            for (let y: number = 0; y < this.size; y++) {
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
        return this._size;
    }

    public set size(value : number) {
        this._size = value;
    }

    public get cells(): any[] {
        return this._cells;
    }
        
    public set cells(value : any[]) {
        this._cells = value;
    }

    public get previousState() : Tile[][] {
        return this._previousState;
    }

    public set previousState(value : Tile[][]) {
        this._previousState = value;
    }
}