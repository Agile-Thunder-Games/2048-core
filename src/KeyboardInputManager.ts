import {Direction} from "./Direction"

export class KeyboardInputManager {
    private events: string[];
    private eventTouchStart: string;
    private eventTouchMove: string;
    private eventTouchEnd: string;
        
    public constructor() {
        this.events = [];

        if (window.navigator.msPointerEnabled) {
            //Internet Explorer 10 style
            this.eventTouchStart = "MSPointerDown";
            this.eventTouchMove = "MSPointerMove";
            this.eventTouchEnd = "MSPointerUp";
        } else {
            this.eventTouchStart = "touchstart";
            this.eventTouchMove = "touchmove";
            this.eventTouchEnd = "touchend";
        }

        this.listen();
    }

    public on(event: string, callback: () => string): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(callback);
    }

    public emit(event: string, data: any): void {
        let callbacks: Function[] = this.events[event];
                
        if (callbacks) {
            /*callbacks.forEach((callback: any) => {
                callback(data);
            });*/

            for(let callback of callbacks) {
                callback(data);
            }
        }
    }

    public listen(): void {
        /*let map: any = {
            38: 0, // Up
            39: 1, // Right
            40: 2, // Down
            37: 3, // Left
            75: 0, // Vim up
            76: 1, // Vim right
            74: 2, // Vim down
            72: 3, // Vim left
            87: 0, // W
            68: 1, // D
            83: 2, // S
            65: 3,  // A
        };*/

        /*const map: any = {
            38: 0, // Up
            39: 1, // Right
            40: 2, // Down
            37: 3, // Left
        }; // Todo TypeScript Tuple*/

        /*const map: any = [
            { 38: Direction.Up },
            { 39: Direction.Right },
            { 40: Direction.Down },
            { 37: Direction.Left }
        ];*/
    
        document.addEventListener("keydown", (event: KeyboardEvent): void => {
            let modifiers: boolean = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
            let mapped: Direction; //= map[event.which];

            console.log(`event.which.valueOf() == ${event.which.valueOf()}`);
            console.log(`${event.key} ==  ${event.key} == ${event.keyCode}`);

            //if(!modifiers) {
                // Test case
               /* if(event.which == 38) { // Todo make with switch case statement
                    console.log("Up");
                    mapped = Direction.Up;
                } else if(event.which == 39) {
                    console.log("Right");
                    mapped = Direction.Right;
                } else if(event.which == 40) {
                    console.log("Down");
                    mapped = Direction.Down;
                } else if (event.which == 37) {
                    console.log("Left");
                    mapped = Direction.Left;
                } else {
                    console.log("Error");
                }*/
            //}
            // mapped to direction or movecode
            if(!modifiers) {
                switch(event.keyCode) {
                    case 38: 
                        mapped = Direction.Up;
                        break;
                    case 39:
                        mapped = Direction.Right;
                        break;
                    case 40:
                        mapped = Direction.Down;
                        break;
                    case 37:
                        mapped = Direction.Left;
                        break;
                    default:
                        // Todo
                        console.log("Error");
                        break;
                }   
            }

            console.log(`typeof(mapped) is undefined == ${typeof(mapped) == undefined}`);
            console.log(`statement(mapped !== undefined) == ${mapped !== undefined}`);

            if (!modifiers) {
                if (mapped !== undefined) {
                    event.preventDefault();

                    this.emit("move", mapped);
                }
            }

            // R key restarts the game
            /*if (!modifiers && event.which === 82) {
                this.restart.call(this, event);
            }*/ // This dot work
        });

        // Respond to button presses
        this.bindButtonPress(".retry-button", this.restart);
        this.bindButtonPress(".restart-button", this.restart);
        this.bindButtonPress(".keep-playing-button", this.keepPlaying);

        // Respond to swipe events
        let touchStartClientX: number;
        let touchStartClientY: number;
        //let gameContainer: Element = document.getElementsByClassName("game-container")[0];
        let gameContainer: Element = document.querySelector(".game-container");

        gameContainer.addEventListener(this.eventTouchStart, (event: any): void => { // Todo
            /*if ((!window.navigator.msPointerEnabled && event.touches.length > 1) || event.targetTouches.length > 1) {
                return; // Ignore if touching with more than 1 finger
            }*/

            if (window.navigator.msPointerEnabled) {
                touchStartClientX = event.pageX;
                touchStartClientY = event.pageY;
            } else {
                touchStartClientX = event.touches[0].clientX;
                touchStartClientY = event.touches[0].clientY;
            }

            event.preventDefault();
        });

        // from any to Event
        gameContainer.addEventListener(this.eventTouchMove, (event: Event): void => {
            event.preventDefault();
        });

        gameContainer.addEventListener(this.eventTouchEnd, (event: TouchEvent | any): void => { // Todo
            /*if ((!window.navigator.msPointerEnabled && event.touches.length > 0) || event.targetTouches.length > 0) {
                return; // Ignore if still touching with one or more fingers
            }*/

            let touchEndClientX: number;
            let touchEndClientY: number;

            if (window.navigator.msPointerEnabled) {
                touchEndClientX = event.pageX;
                touchEndClientY = event.pageY;
            } else {
                touchEndClientX = event.changedTouches[0].clientX;
                touchEndClientY = event.changedTouches[0].clientY;
            }

            let dx: number = touchEndClientX - touchStartClientX;
            let absDx: number = Math.abs(dx);

            let dy: number = touchEndClientY - touchStartClientY;
            let absDy: number = Math.abs(dy);

            if (Math.max(absDx, absDy) > 10) {
                // (right : left) : (down : up)
                this.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0)); // Todo
            }
        });
    }

    public restart(event: Event): void {
        event.preventDefault();

        this.emit("restart", null);
    }

    public keepPlaying(event: Event): void {
        event.preventDefault();
            
        this.emit("keepPlaying", null);
    }

    public bindButtonPress(selector: string, fn: Function): void {
        let button: Element = document.querySelector(selector);
            
        button.addEventListener("click", fn.bind(this));
        button.addEventListener(this.eventTouchEnd, fn.bind(this));
    }
}