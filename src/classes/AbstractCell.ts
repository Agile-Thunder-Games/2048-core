export abstract class AbstractCell {
    private _position: IPosition;
    private _value: number;
    private _previousPosition: IPosition;
    private _x: number;
    private _y: number;
    private _mergedFrom: AbstractCell[];

    constructor(position: IPosition, value: number) {
        this.x = position.x;
        this.y = position.y;
        this.value = value || 2; // todo
        this.previousPosition = null;
        this.mergedFrom = null;
    }

    abstract savePosition(): void;

    abstract updatePosition(position: IPosition): void;

    abstract serialize(): any;

    public get position() : IPosition {
        return this._position;
    }
        
    public set position(value : IPosition) {
        this._position = value;
    }

    public get value() : number {
        return this._value;
    }

    public set value(value : number) {
        this._value = value;
    }
        
    public get previousPosition() : IPosition {
        return this._previousPosition;
    }

    public set previousPosition(value : IPosition) {
        this._previousPosition = value;
    }

    public get x() : number {
        return this._x;
    }
        
    public set x(value : number) {
        this._x = value;
    }
        
    public get y() : number {
        return this._y;
    }
        
    public set y(value : number) {
        this._y = value;
    }

    public get mergedFrom() : AbstractCell[] {
        return this._mergedFrom;
    }
        
    public set mergedFrom(value : AbstractCell[]) {
        this._mergedFrom = value;
    }
}