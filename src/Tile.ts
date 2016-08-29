export class Tile {
    /*private _position: IPosition;
    private _value: number;
    private _previousPosition: IPosition;
    private _x: number;
    private _y: number;
    private _mergedFrom: Tile[];*/

    constructor(position: IPosition, value: number) {
        this.x = position.x;
        this.y = position.y;
        this.value = value || 2; // todo
        this.previousPosition = null;
        this.mergedFrom = null;
    }

    public savePosition(): void {
        this.previousPosition = { 
            x: this.x,
            y: this.y,
        };
    }

    public updatePosition(position: IPosition): void {
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

    public get position() : IPosition {
        return this.position;
    }
        
    public set position(value : IPosition) {
        this.position = value;
    }

    public get value() : number {
        return this.value;
    }

    public set value(value : number) {
        this.value = value;
    }
        
    public get previousPosition() : IPosition {
        return this.previousPosition;
    }

    public set previousPosition(value : IPosition) {
        this.previousPosition = value;
    }

    public get x() : number {
        return this.x;
    }
        
    public set x(value : number) {
        this.x = value;
    }
        
    public get y() : number {
        return this.y;
    }
        
    public set y(value : number) {
        this.y = value;
    }

    public get mergedFrom() : Tile[] {
        return this.mergedFrom;
    }
        
    public set mergedFrom(value : Tile[]) {
        this.mergedFrom = value;
    }
}