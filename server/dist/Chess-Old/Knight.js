"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knight = void 0;
const ChessApp_1 = require("./ChessApp");
const Piece_1 = require("./Piece");
class Knight extends Piece_1.Piece {
    FindMovementAvailableCells() {
        let teamCellList = [];
        let northCell = this.FindNorthCell(this.currentStandingCell);
        let westCell = this.FindWestCell(this.currentStandingCell);
        let southCell = this.FindSouthCell(this.currentStandingCell);
        let eastCell = this.FindEastCell(this.currentStandingCell);
        if (northCell) {
            let northNorthWestCell = this.FindNorthWestCell(northCell);
            let northNorthEastCell = this.FindNorthEastCell(northCell);
            if (northNorthWestCell && this.CanMoveToCellWithAttack(northNorthWestCell))
                teamCellList.push(northNorthWestCell);
            if (northNorthEastCell && this.CanMoveToCellWithAttack(northNorthEastCell))
                teamCellList.push(northNorthEastCell);
        }
        if (westCell) {
            let westNorthWestCell = this.FindNorthWestCell(westCell);
            let westSouthWestCell = this.FindSouthWestCell(westCell);
            if (westNorthWestCell) {
                if (this.CanMoveToCellWithAttack(westNorthWestCell)) {
                    teamCellList.push(westNorthWestCell);
                }
            }
            if (westSouthWestCell) {
                if (this.CanMoveToCellWithAttack(westSouthWestCell)) {
                    teamCellList.push(westSouthWestCell);
                }
            }
        }
        if (southCell) {
            let southSouthWestCell = this.FindSouthWestCell(southCell);
            let southSouthEastCell = this.FindSouthEastCell(southCell);
            if (southSouthWestCell) {
                if (this.CanMoveToCellWithAttack(southSouthWestCell)) {
                    teamCellList.push(southSouthWestCell);
                }
            }
            if (southSouthEastCell) {
                if (this.CanMoveToCellWithAttack(southSouthEastCell)) {
                    teamCellList.push(southSouthEastCell);
                }
            }
        }
        if (eastCell) {
            let eastNorthEastCell = this.FindNorthEastCell(eastCell);
            let eastSouthEastCell = this.FindSouthEastCell(eastCell);
            if (eastNorthEastCell) {
                if (this.CanMoveToCellWithAttack(eastNorthEastCell)) {
                    teamCellList.push(eastNorthEastCell);
                }
            }
            if (eastSouthEastCell) {
                if (this.CanMoveToCellWithAttack(eastSouthEastCell)) {
                    teamCellList.push(eastSouthEastCell);
                }
            }
        }
        return teamCellList;
    }
    constructor(x, y, team, cellList, pieceList) {
        var _a;
        super(x, y, team, cellList, pieceList);
        (_a = this.img) === null || _a === void 0 ? void 0 : _a.classList.add(`${Knight.name}`);
        this.PieceType = ChessApp_1.PieceType.Knight;
    }
}
exports.Knight = Knight;
