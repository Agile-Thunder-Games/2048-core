class Tile {
    private position: Position;
    private value: number;
    private previousPosition: any;
    private x: number;
    private y: number;
    private mergedFrom: any;
    
    public constructor(position: Position, value: number) {
        this.x = position.x;
        this.y = position.y;
        this.value = value || 2;
        this.previousPosition = null;
        this.mergedFrom = null;
    }

    public savePosition(): void {
        this.previousPosition = { 
            x: this.x, 
            y: this.y 
        };
    }

    public updatePosition(position: Position): void {
        this.x = position.x;
        this.y = position.y;
    }
    
    public serialize(): any {
        return {
            position: {
                x: this.x,
                y: this.y
            },
            value: this.value
        };
    }
}