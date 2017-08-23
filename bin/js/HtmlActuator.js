System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HtmlActuator;
    return {
        setters: [],
        execute: function () {
            HtmlActuator = class HtmlActuator {
                constructor() {
                    this.tileContainer = document.querySelector(".tile-container");
                    this.scoreContainer = document.querySelector(".score-container");
                    this.bestContainer = document.querySelector(".best-container");
                    this.gridContainer = document.querySelector(".grid-container");
                    this.gameContainer = document.querySelector(".game-message");
                    this.score = 0;
                    this.createCells();
                }
                createCells() {
                    let gridRow;
                    let gridCell;
                    for (let r = 0; r < 4; r++) {
                        gridRow = document.createElement("div");
                        gridRow.className = "grid-row";
                        for (let c = 0; c < 4; c++) {
                            gridCell = document.createElement("div");
                            gridCell.className = "grid-cell";
                            gridRow.appendChild(gridCell);
                        }
                        this.gridContainer.appendChild(gridRow);
                    }
                }
                actuate(grid, metadata) {
                    window.requestAnimationFrame(() => {
                        this.clearContainer(this.tileContainer);
                        for (let column of grid.cells) {
                            for (let cell of column) {
                                if (cell) {
                                    this.addTile(cell);
                                }
                            }
                        }
                        this.updateScore(metadata.score);
                        this.updateBestScore(metadata.bestScore);
                        if (metadata.terminated) {
                            if (metadata.won) {
                                this.message(true);
                            }
                            else {
                                this.message(false);
                            }
                        }
                    });
                }
                continueGame() {
                    this.clearMessage();
                }
                clearContainer(container) {
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }
                }
                addTile(tile) {
                    let wrapper = document.createElement("div");
                    let inner = document.createElement("div");
                    let position = tile.previousPosition || { x: tile.x, y: tile.y };
                    let positionClass = this.positionClass(position);
                    let classes = ["tile", `tile-${tile.value}`, positionClass];
                    if (tile.value > 2048) {
                        classes.push("tile-super");
                    }
                    this.applyClasses(wrapper, classes);
                    inner.classList.add("tile-inner");
                    inner.innerHTML = tile.value.toString();
                    if (tile.previousPosition) {
                        window.requestAnimationFrame(() => {
                            classes[2] = this.positionClass({
                                x: tile.x,
                                y: tile.y
                            });
                            this.applyClasses(wrapper, classes);
                        });
                    }
                    else if (tile.mergedFrom) {
                        classes.push("tile-merged");
                        this.applyClasses(wrapper, classes);
                        for (let merged of tile.mergedFrom) {
                            this.addTile(merged);
                        }
                    }
                    else {
                        classes.push("tile-new");
                        this.applyClasses(wrapper, classes);
                    }
                    wrapper.appendChild(inner);
                    this.tileContainer.appendChild(wrapper);
                }
                applyClasses(element, classes) {
                    element.className = classes.join(" ");
                }
                normalizePosition(position) {
                    return {
                        x: position.x + 1,
                        y: position.y + 1
                    };
                }
                positionClass(position) {
                    position = this.normalizePosition(position);
                    return `tile-position-${position.x}-${position.y}`;
                }
                updateScore(score) {
                    this.clearContainer(this.scoreContainer);
                    this.score = score;
                    this.scoreContainer.innerHTML = this.score.toString();
                }
                updateBestScore(bestScore) {
                    this.bestContainer.innerHTML = bestScore.toString();
                }
                message(won) {
                    let message;
                    let type;
                    if (won) {
                        type = "game-won";
                        message = "You win!";
                    }
                    else {
                        type = "game-over";
                        message = "Game over!";
                    }
                    this.gameContainer.classList.add(type);
                    this.gameContainer.querySelector(".message").innerHTML = message;
                }
                clearMessage() {
                    this.gameContainer.classList.remove("game-won");
                    this.gameContainer.classList.remove("game-over");
                }
            };
            exports_1("HtmlActuator", HtmlActuator);
        }
    };
});
