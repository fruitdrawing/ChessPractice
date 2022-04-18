"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bishop = void 0;
const ChessApp_1 = require("./ChessApp");
const Piece_1 = require("./Piece");
class Bishop extends Piece_1.Piece {
    FindMovementAvailableCells() {
        let teamCellList = [];
        let northWestCell = this.FindNorthWestCell(this.currentStandingCell);
        let northEastCell = this.FindNorthEastCell(this.currentStandingCell);
        let southWestCell = this.FindSouthWestCell(this.currentStandingCell);
        let southEastCell = this.FindSouthEastCell(this.currentStandingCell);
        for (let i = 0; i < 8; i++) {
            if (northWestCell && this.CanMoveToCellWithAttack(northWestCell)) {
                teamCellList.push(northWestCell);
                northWestCell = this.FindNorthWestCell(northWestCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (northEastCell && this.CanMoveToCellWithAttack(northEastCell)) {
                teamCellList.push(northEastCell);
                northEastCell = this.FindNorthEastCell(northEastCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southWestCell && this.CanMoveToCellWithAttack(southWestCell)) {
                teamCellList.push(southWestCell);
                southWestCell = this.FindSouthWestCell(southWestCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southEastCell && this.CanMoveToCellWithAttack(southEastCell)) {
                teamCellList.push(southEastCell);
                southEastCell = this.FindSouthEastCell(southEastCell);
                continue;
            }
            else {
                break;
            }
        }
        return teamCellList;
    }
    constructor(x, y, team, cellList, pieceList) {
        var _a;
        super(x, y, team, cellList, pieceList);
        (_a = this.img) === null || _a === void 0 ? void 0 : _a.classList.add(`${Bishop.name}`);
        this.PieceType = ChessApp_1.PieceType.Bishop;
    }
}
exports.Bishop = Bishop;
