class HtmlActuator {
    private score: number;
    private tileContainer: any;
    private scoreContainer: any;
    private bestContainer: any;
    private messageContainer: any;
    
    public constructor() {
        this.tileContainer = document.querySelector(".tile-container");
        this.scoreContainer = document.querySelector(".score-container");
        this.bestContainer = document.querySelector(".best-container");
        this.messageContainer = document.querySelector(".game-message");
        
        this.score = 0;
    }

    public actuate(grid: Grid, metadata: any): void {
        let self: HtmlActuator = this;

        window.requestAnimationFrame(function () {
            self.clearContainer(self.tileContainer);

            grid.cells.forEach(function (column: Tile[]) {
                column.forEach(function (cell: Tile) {
                    if (cell) {
                        self.addTile(cell);
                    }
                });
            });

            self.updateScore(metadata.score);
            self.updateBestScore(metadata.bestScore);

            if (metadata.terminated) {
                if (metadata.over) {
                    self.message(false); // You lose
                } else if (metadata.won) {
                    self.message(true); // You win!
                }
            }
        });
    }

    public continueGame(): void {
        this.clearMessage();
    }

    public clearContainer(container: HTMLElement): void {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    public addTile(tile: Tile): void {
        let self: HtmlActuator = this;

        let wrapper: HTMLDivElement = document.createElement("div");
        let inner: HTMLDivElement = document.createElement("div");
        let position : Point = tile.previousPosition || { x: tile.x, y: tile.y };
        let positionClass: string = this.positionClass(position);

        let classes: string[] = ["tile", "tile-" + tile.value, positionClass];

        if (tile.value > 2048) classes.push("tile-super");

        this.applyClasses(wrapper, classes);

        inner.classList.add("tile-inner");
        inner.textContent = tile.value.toString();

        if (tile.previousPosition) {
            window.requestAnimationFrame(function () {
                classes[2] = self.positionClass({ 
                    x: tile.x, 
                    y: tile.y
                });

                self.applyClasses(wrapper, classes);
            });
        } else if (tile.mergedFrom) {
            classes.push("tile-merged");

            this.applyClasses(wrapper, classes);

            tile.mergedFrom.forEach(function (merged: Tile) {
                self.addTile(merged);
            });
        } else {
            classes.push("tile-new");

            this.applyClasses(wrapper, classes);
        }

        wrapper.appendChild(inner);

        this.tileContainer.appendChild(wrapper);
    }

    public applyClasses(element: HTMLElement, classes: string[]): void {
        element.setAttribute("class", classes.join(" "));
    }

    public normalizePosition(position: Point): Point {
        return { 
            x: position.x + 1, 
            y: position.y + 1
        };
    }

    public positionClass(position: Point): string {
        position = this.normalizePosition(position);
        
        return "tile-position-" + position.x + "-" + position.y;
    }

    public updateScore(score: number): void {
        this.clearContainer(this.scoreContainer);

        let difference: number = score - this.score;
        
        this.score = score;
        this.scoreContainer.textContent = this.score;

        if (difference > 0) {
            let addition: HTMLDivElement = document.createElement("div");
            
            addition.classList.add("score-addition");
            addition.textContent = "+" + difference;

            this.scoreContainer.appendChild(addition);
        } 
    }

    public updateBestScore(bestScore: number): void {
        this.bestContainer.textContent = bestScore;
    }

    public message(won: boolean): void {
        let type: string = won ? "game-won" : "game-over";
        let message: string = won ? "You win!" : "Game over!";

        this.messageContainer.classList.add(type);
        this.messageContainer.getElementsByTagName("p")[0].textContent = message;
    }

    public clearMessage(): void {
        // IE only takes one value to remove at a time.
        this.messageContainer.classList.remove("game-won");
        this.messageContainer.classList.remove("game-over");
    };
}