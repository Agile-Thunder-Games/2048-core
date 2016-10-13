import {KeyboardInputManager} from "./KeyboardInputManager";
import {LocalStorageManager} from "./LocalStorageManager";
import {Grid} from "./Grid";
import {Tile} from "./Tile";

export class HtmlActuator {
    private tileContainer: Element;
    private scoreContainer: Element;
    private bestContainer: Element;
    private gameContainer: Element;
    private gridContainer: Element;
    private score: number;

    public constructor() {
        this.tileContainer = document.querySelector(".tile-container");
        this.scoreContainer = document.querySelector(".score-container");
        this.bestContainer = document.querySelector(".best-container");
        this.gameContainer = document.querySelector(".game-message");
        this.gridContainer = document.querySelector(".grid-container");

        this.score = 0;

        this.createCells();
    }

    public createCells(): void {
        let gridRow: Element;
	    let gridCell: Element;

		for (var r = 0; r < 4; r++) {
			gridRow = document.createElement("div");
			gridRow.className = "grid-row";

			for (var c = 0; c < 4; c++) {
				gridCell = document.createElement("div");
					
				gridCell.className = "grid-cell";

				gridRow.appendChild(gridCell);
			}

			this.gridContainer.appendChild(gridRow);
		}
    }

    public actuate(grid: Grid, metadata: IMetadata): void {
        window.requestAnimationFrame((): void => {
            this.clearContainer(this.tileContainer);

            for(let column of grid.cells) {
                for(let cell of column) {
                    if (cell) {
                        this.addTile(cell);
                    }
                }
            }

            this.updateScore(metadata.score);
            this.updateBestScore(metadata.bestScore);

            if (metadata.terminated) {
                if(metadata.won) {
                    this.message(true); // Win
                } else {
                    this.message(false); // Lose
                }
            }
        });
    }

    public continueGame(): void {
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
        inner.innerHTML = tile.value.toString();

        if (tile.previousPosition) {
            window.requestAnimationFrame((): void => {
                classes[2] = this.positionClass({ 
                    x: tile.x,
                    y: tile.y
                });

                this.applyClasses(wrapper, classes);
            });
        } else if (tile.mergedFrom) {
            classes.push("tile-merged");

            this.applyClasses(wrapper, classes);

            for(let merged of tile.mergedFrom) {
                this.addTile(merged);
            }
        } else {
            classes.push("tile-new");

            this.applyClasses(wrapper, classes);
        }

        console.log(`Element classes are ${classes}`);
        wrapper.appendChild(inner);

        this.tileContainer.appendChild(wrapper);
    }

    public applyClasses(element: HTMLElement, classes: string[]): void {
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
        this.score = score;
        this.scoreContainer.innerHTML = this.score.toString() as string;
    }

    public updateBestScore(bestScore: number): void {
        this.bestContainer.innerHTML = bestScore.toString() as string;
    }

    public message(won: boolean): void {        
        let message: string;
        let type: string;

        if (won) {
            type = "game-won";
            message = "You win!";
        } else {
            type = "game-over";
            message = "Game over!";
        }

        this.gameContainer.classList.add(type);
        this.gameContainer.querySelector(".message").innerHTML = message;
    }

    public clearMessage(): void {
        // IE only takes one value to remove at a time.
        this.gameContainer.classList.remove("game-won");
        this.gameContainer.classList.remove("game-over");
    }
}