"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const Vector2_1 = require("./Vector2");
class Cell {
    constructor(x, y) {
        this.piece = undefined;
        this.position = new Vector2_1.Vector2(x, y);
    }
    GetStandingPiece() {
        return this.piece;
    }
    SetStandingPiece(piece) {
        this.piece = piece;
    }
}
exports.Cell = Cell;
