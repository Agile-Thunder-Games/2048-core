import {KeyboardInputManager} from "./KeyboardInputManager"
import {LocalStorageManager} from "./LocalStorageManager"
import {Grid} from "./Grid"
import {Tile} from "./Tile"

export class HtmlActuator {
    private tileContainer: Element;
    private scoreContainer: Element;
    private bestContainer: Element;
    private messageContainer: Element;
    private score: number;

    public constructor() {
        this.tileContainer = document.querySelector(".tile-container");
        this.scoreContainer = document.querySelector(".score-container");
        this.bestContainer = document.querySelector(".best-container");
        this.messageContainer = document.querySelector(".game-message"); // message-container

        this.score = 0;
    }

    public actuate(grid: Grid, metadata: IMetadata): void {
        window.requestAnimationFrame((): void => {
            this.clearContainer(this.tileContainer);

            /*grid.cells.forEach((column: Tile[]) => {
                column.forEach((cell: Tile) => {
                    if (cell) {
                        this.addTile(cell);
                        console.log(`Cell ${JSON.stringify(cell)}`);
                    }
                });
            });*/

            for(let column of grid.cells) { // cells
                for(let cell of column) {
                    if (cell) {
                        this.addTile(cell);
                    }
                }
            }

            this.updateScore(metadata.score);
            this.updateBestScore(metadata.bestScore);

            if (metadata.terminated) {
                /*if (metadata.over) {
                    this.message(false); // You lose
                } else if (metadata.won) {
                    this.message(true); // You win!
                }*/

                if(metadata.won) {
                    this.message(true); // Win
                } else {
                    this.message(false); // Lose
                }
            }
        });
    }

    public continueGame(): void { // todo remove
        this.clearMessage();
    }

    public clearContainer(container: Element): void {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    public addTile(tile: Tile): void {
        let wrapper: HTMLDivElement = document.createElement("div");
        let inner: HTMLDivElement = document.createElement("div");
        let position : IPosition = tile.previousPosition || { x: tile.x, y: tile.y };
        let positionClass: string = this.positionClass(position);

        let classes: string[] = ["tile", `tile-${tile.value}`, positionClass];

        if (tile.value > 2048) {
            classes.push("tile-super");
        }

        this.applyClasses(wrapper, classes);

        inner.classList.add("tile-inner");
        //inner.textContent = tile.value.toString();
        inner.innerHTML = tile.value.toString();

        if (tile.previousPosition) {
            window.requestAnimationFrame((): void => {
                // Todo
                classes[2] = this.positionClass({ 
                    x: tile.x,
                    y: tile.y
                }); // Todo 

                this.applyClasses(wrapper, classes);
            });
        } else if (tile.mergedFrom) {
            classes.push("tile-merged");

            this.applyClasses(wrapper, classes);

            /*tile.mergedFrom.forEach((merged: Tile) => {
                this.addTile(merged);
                console.log("Merged");
            });*/

            for(let merged of tile.mergedFrom) {
                this.addTile(merged);
            }
        } else {
            classes.push("tile-new");

            this.applyClasses(wrapper, classes);
        }

        console.log(`Element classes are ${classes}`);
        //alert(`Element classes are ${classes}`);
        wrapper.appendChild(inner);

        this.tileContainer.appendChild(wrapper);
    }

    public applyClasses(element: HTMLElement, classes: string[]): void {
        //element.setAttribute("class", classes.join(" "));
        element.className = classes.join(" ");
    }

    public normalizePosition(position: IPosition): IPosition {
        return { 
            x: position.x + 1,
            y: position.y + 1
        };
    }

    public positionClass(position: IPosition): string {
        position = this.normalizePosition(position);
            
        return `tile-position-${position.x}-${position.y}`;
    }

    public updateScore(score: number): void {
        this.clearContainer(this.scoreContainer);

        //let difference: number = score - this.score; // todo
            
        this.score = score;
        //this.scoreContainer.textContent = this.score;
        this.scoreContainer.innerHTML = this.score.toString();
    }

    public updateBestScore(bestScore: number): void {
        //this.bestContainer.textContent = bestScore;
        this.bestContainer.innerHTML = bestScore.toString();
    }

    public message(won: boolean): void {
        //let type: string = won ? "game-won" : "game-over";
        //let message: string = won ? "You win! :)" : "Game over! :(";

        //let message: string;

        /*if(won) {
            message = "You win! :)";
        } else {
            message = "Game over! :(";
        }*/
        
        let message: string;
        let type: string;

        if (won) {
            type = "game-won";
            message = "You win!";
        } else {
            type = "game-over";
            message = "Game over!";
        }

        this.messageContainer.classList.add(type);
        //this.messageContainer.getElementsByTagName("p")[0].textContent = message;
        this.messageContainer.querySelector(".message").innerHTML = message;
    }

    public clearMessage(): void {
        // IE only takes one value to remove at a time.
        this.messageContainer.classList.remove("game-won");
        this.messageContainer.classList.remove("game-over");
    }
}