"use strict";
exports.__esModule = true;
exports.Cell = void 0;
var Vector2_1 = require("./Vector2");
var Cell = /** @class */ (function () {
    function Cell(x, y) {
        this.piece = undefined;
        this.position = new Vector2_1.Vector2(x, y);
    }
    Cell.prototype.GetStandingPiece = function () {
        return this.piece;
    };
    Cell.prototype.SetStandingPiece = function (piece) {
        this.piece = piece;
    };
    return Cell;
}());
exports.Cell = Cell;
