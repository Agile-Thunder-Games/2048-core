System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HtmlActuator;
    return {
        setters: [],
        execute: function () {
            HtmlActuator = (function () {
                function HtmlActuator() {
                    this.tileContainer = document.querySelector(".tile-container");
                    this.scoreContainer = document.querySelector(".score-container");
                    this.bestContainer = document.querySelector(".best-container");
                    this.gridContainer = document.querySelector(".grid-container");
                    this.gameContainer = document.querySelector(".game-message");
                    this.score = 0;
                    this.createCells();
                }
                HtmlActuator.prototype.createCells = function () {
                    var gridRow;
                    var gridCell;
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
                };
                HtmlActuator.prototype.actuate = function (grid, metadata) {
                    var _this = this;
                    window.requestAnimationFrame(function () {
                        _this.clearContainer(_this.tileContainer);
                        for (var _i = 0, _a = grid.cells; _i < _a.length; _i++) {
                            var column = _a[_i];
                            for (var _b = 0, column_1 = column; _b < column_1.length; _b++) {
                                var cell = column_1[_b];
                                if (cell) {
                                    _this.addTile(cell);
                                }
                            }
                        }
                        _this.updateScore(metadata.score);
                        _this.updateBestScore(metadata.bestScore);
                        if (metadata.terminated) {
                            if (metadata.won) {
                                _this.message(true);
                            }
                            else {
                                _this.message(false);
                            }
                        }
                    });
                };
                HtmlActuator.prototype.continueGame = function () {
                    this.clearMessage();
                };
                HtmlActuator.prototype.clearContainer = function (container) {
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }
                };
                HtmlActuator.prototype.addTile = function (tile) {
                    var _this = this;
                    var wrapper = document.createElement("div");
                    var inner = document.createElement("div");
                    var position = tile.previousPosition || { x: tile.x, y: tile.y };
                    var positionClass = this.positionClass(position);
                    var classes = ["tile", "tile-" + tile.value, positionClass];
                    if (tile.value > 2048) {
                        classes.push("tile-super");
                    }
                    this.applyClasses(wrapper, classes);
                    inner.classList.add("tile-inner");
                    inner.innerHTML = tile.value.toString();
                    if (tile.previousPosition) {
                        window.requestAnimationFrame(function () {
                            classes[2] = _this.positionClass({
                                x: tile.x,
                                y: tile.y
                            });
                            _this.applyClasses(wrapper, classes);
                        });
                    }
                    else if (tile.mergedFrom) {
                        classes.push("tile-merged");
                        this.applyClasses(wrapper, classes);
                        for (var _i = 0, _a = tile.mergedFrom; _i < _a.length; _i++) {
                            var merged = _a[_i];
                            this.addTile(merged);
                        }
                    }
                    else {
                        classes.push("tile-new");
                        this.applyClasses(wrapper, classes);
                    }
                    wrapper.appendChild(inner);
                    this.tileContainer.appendChild(wrapper);
                };
                HtmlActuator.prototype.applyClasses = function (element, classes) {
                    element.className = classes.join(" ");
                };
                HtmlActuator.prototype.normalizePosition = function (position) {
                    return {
                        x: position.x + 1,
                        y: position.y + 1
                    };
                };
                HtmlActuator.prototype.positionClass = function (position) {
                    position = this.normalizePosition(position);
                    return "tile-position-" + position.x + "-" + position.y;
                };
                HtmlActuator.prototype.updateScore = function (score) {
                    this.clearContainer(this.scoreContainer);
                    this.score = score;
                    this.scoreContainer.innerHTML = this.score.toString();
                };
                HtmlActuator.prototype.updateBestScore = function (bestScore) {
                    this.bestContainer.innerHTML = bestScore.toString();
                };
                HtmlActuator.prototype.message = function (won) {
                    var message;
                    var type;
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
                };
                HtmlActuator.prototype.clearMessage = function () {
                    this.gameContainer.classList.remove("game-won");
                    this.gameContainer.classList.remove("game-over");
                };
                return HtmlActuator;
            }());
            exports_1("HtmlActuator", HtmlActuator);
        }
    };
});
