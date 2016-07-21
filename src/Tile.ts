class Tile {
    public position: Position;
    public value: number;
    public previousPosition: any;
    public x: number;
    public y: number;
    public mergedFrom: any;
    
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