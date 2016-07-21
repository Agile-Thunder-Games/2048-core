class HTMLActuator {
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

    public actuate(grid: any, metadata: any): void {
        var self = this;

        window.requestAnimationFrame(function () {
            self.clearContainer(self.tileContainer);

            grid.cells.forEach(function (column: any) {
                column.forEach(function (cell: any) {
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

    addTile(tile: any): void {
        var self = this;

        var wrapper = document.createElement("div");
        var inner = document.createElement("div");
        var position = tile.previousPosition || { x: tile.x, y: tile.y };
        var positionClass = this.positionClass(position);

        var classes = ["tile", "tile-" + tile.value, positionClass];

        if (tile.value > 2048) classes.push("tile-super");

        this.applyClasses(wrapper, classes);

        inner.classList.add("tile-inner");
        inner.textContent = tile.value;

        if (tile.previousPosition) {
            // Make sure that the tile gets rendered in the previous position first
            window.requestAnimationFrame(function () {
                classes[2] = self.positionClass({ 
                    x: tile.x, 
                    y: tile.y
                });

                self.applyClasses(wrapper, classes); // Update the position
            });
        } else if (tile.mergedFrom) {
            classes.push("tile-merged");

            this.applyClasses(wrapper, classes);

            // Render the tiles that merged
            tile.mergedFrom.forEach(function (merged: any) {
                self.addTile(merged);
            });
        } else {
            classes.push("tile-new");

            this.applyClasses(wrapper, classes);
        }

        // Add the inner part of the tile to the wrapper
        wrapper.appendChild(inner);

        // Put the tile on the board
        this.tileContainer.appendChild(wrapper);
    }

    public applyClasses(element: HTMLElement, classes: any): void {
        element.setAttribute("class", classes.join(" "));
    }

    public normalizePosition(position: Position): any {
        return { 
            x: position.x + 1, 
            y: position.y + 1 
        };
    }

    public positionClass(position: any): string {
        position = this.normalizePosition(position);
        
        return "tile-position-" + position.x + "-" + position.y;
    }

    public updateScore(score: number): void {
        this.clearContainer(this.scoreContainer);

        var difference = score - this.score;
        
        this.score = score;
        this.scoreContainer.textContent = this.score;

        if (difference > 0) {
            var addition = document.createElement("div");
            
            addition.classList.add("score-addition");
            addition.textContent = "+" + difference;

            this.scoreContainer.appendChild(addition);
        } 
    }

    public updateBestScore(bestScore: number): void {
        this.bestContainer.textContent = bestScore;
    }

    public message(won: boolean): void {
        var type = won ? "game-won" : "game-over";
        var message = won ? "You win!" : "Game over!";

        this.messageContainer.classList.add(type);
        this.messageContainer.getElementsByTagName("p")[0].textContent = message;
    }

    public clearMessage(): void {
        // IE only takes one value to remove at a time.
        this.messageContainer.classList.remove("game-won");
        this.messageContainer.classList.remove("game-over");
    };
}