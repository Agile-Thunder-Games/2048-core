class Tile {
    public position: Point;
    public value: number;
    public previousPosition: Point;
    public x: number;
    public y: number;
    public mergedFrom: Tile[];
    
    public constructor(position: Point, value: number) {
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

    public updatePosition(position: Point): void {
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