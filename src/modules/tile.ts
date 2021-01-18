import { Position } from "./types";

export default class Tile {
    private _position: Position;
    private _value: number;
    private _previousPosition: Position;
    private _x: number;
    private _y: number;
    private _mergedFrom: Tile[];

    constructor(position: Position, value: number) {
        this.x = position.x;
        this.y = position.y;
        this.value = value || 2;
        this.previousPosition = null;
        this.mergedFrom = null;
    }

    public savePosition(): void {
        this.previousPosition = { 
            x: this.x,
            y: this.y,
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

    public get position() : Position {
        return this._position;
    }
        
    public set position(value : Position) {
        this._position = value;
    }

    public get value() : number {
        return this._value;
    }

    public set value(value : number) {
        this._value = value;
    }
        
    public get previousPosition() : Position {
        return this._previousPosition;
    }

    public set previousPosition(value : Position) {
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

    public get mergedFrom() : Tile[] {
        return this._mergedFrom;
    }
        
    public set mergedFrom(value : Tile[]) {
        this._mergedFrom = value;
    }
}