"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rook = void 0;
const ChessApp_1 = require("./ChessApp");
const Piece_1 = require("./Piece");
class Rook extends Piece_1.Piece {
    FindMovementAvailableCells(cellList) {
        let output = [];
        let northCell = this.FindNorthCell(this.currentStandingCell);
        let westCell = this.FindWestCell(this.currentStandingCell);
        let eastCell = this.FindEastCell(this.currentStandingCell);
        let southCell = this.FindSouthCell(this.currentStandingCell);
        for (let i = 0; i < 8; i++) {
            if (northCell && this.CanMoveToCellWithAttack(northCell)) {
                output.push(northCell);
                northCell = this.FindNorthCell(northCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (westCell && this.CanMoveToCellWithAttack(westCell)) {
                output.push(westCell);
                westCell = this.FindWestCell(westCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (eastCell && this.CanMoveToCellWithAttack(eastCell)) {
                output.push(eastCell);
                eastCell = this.FindEastCell(eastCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southCell && this.CanMoveToCellWithAttack(southCell)) {
                output.push(southCell);
                southCell = this.FindSouthCell(southCell);
                continue;
            }
            else {
                break;
            }
        }
        return output;
    }
    constructor(x, y, team, cellList, pieceList) {
        var _a;
        super(x, y, team, cellList, pieceList);
        (_a = this.img) === null || _a === void 0 ? void 0 : _a.classList.add(`${Rook.name}`);
        this.PieceType = ChessApp_1.PieceType.Rook;
    }
}
exports.Rook = Rook;
