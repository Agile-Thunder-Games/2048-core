class Tile {
    private _position: Point;
    private _value: number;
    private _previousPosition: Point;
    private _x: number;
    private _y: number;
    private _mergedFrom: Tile[];
    
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

    /*
        Getters and setters
    */
    public get position() : Point {
        return this._position;
    }
    
    public set position(p : Point) {
        this._position = p;
    }

    public get value() : number {
        return this._value;
    }

    public set value(v : number) {
        this._value = v;
    }
    
    public get previousPosition() : Point {
        return this._previousPosition;
    }

    public set previousPosition(p : Point) {
        this._previousPosition = p;
    }

    public get x() : number {
        return this._x;
    }
    
    public set x(x : number) {
        this._x = x;
    }
    
    public get y() : number {
        return this._y;
    }
    
    public set y(y : number) {
        this._y = y;
    }

    public get mergedFrom() : Tile[] {
        return this._mergedFrom;
    }
    
    public set mergedFrom(m : Tile[]) {
        this._mergedFrom = m;
    }
}