// Build a grid of the specified size


class Grid {
    private size: any;
    private cells: any[];
    private previousState: any[];

    constructor(size: any, previousState: any[]) {
        this.size = size;
        this.cells = previousState ? this.fromState(previousState) : this.empty();
    }

    empty(): any[] {
        var cells: any = [];

        for (var x = 0; x < this.size; x++) {
            var row: any = cells[x] = [];

            for (var y = 0; y < this.size; y++) {
                row.push(null);
            }
        }

        return cells;
    }

    fromState(state: any) {
        var cells: any = [];

        for (var x = 0; x < this.size; x++) {
            var row: any = cells[x] = [];

            for (var y = 0; y < this.size; y++) {
                var tile = state[x][y];
                
                row.push(tile ? new Tile(tile.position, tile.value) : null);
            }
        }

        return cells;
    }

    // Find the first available random position
    randomAvailableCell(): number {
        var cells = this.availableCells();

        if (cells.length) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    }

    availableCells():any[] {
        var cells: any = [];

        this.eachCell(function (_x: any, _y: any, tile: Tile) {
            if (!tile) {
                cells.push({ x: _x, y: _y });
            }
        });

        return cells;
    }

    eachCell(callback: any): void {
        for (var x = 0; x < this.size; x++) {
            for (var y = 0; y < this.size; y++) {
                callback(x, y, this.cells[x][y]);
            }
        }
    }

    cellsAvailable(): boolean {
        return !!this.availableCells().length;
    }

    cellAvailable(cell: any): boolean {
        return !this.cellOccupied(cell);
    }
    
    cellOccupied(cell: any): boolean {
        return !!this.cellContent(cell);
    }

    cellContent(cell: any): any {
        if (this.withinBounds(cell)) {
            return this.cells[cell.x][cell.y];
        } else {
            return null;
        }
    }

    insertTile(tile: Position):void {
         this.cells[tile.x][tile.y] = tile;
    }

    removeTile(tile: Position): void {
        this.cells[tile.x][tile.y] = null;
    }

    withinBounds(position: Position): boolean {
        return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
    }

    serialize(): any {
        var cellState: any = [];

        for (var x = 0; x < this.size; x++) {
            var row : any = cellState[x] = [];

            for (var y = 0; y < this.size; y++) {
                row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
            }
        }

        return {
            size: this.size,
            cells: cellState
        };
    }
}