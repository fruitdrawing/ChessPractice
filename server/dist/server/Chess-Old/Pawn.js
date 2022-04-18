"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawn = void 0;
const ChessApp_1 = require("./ChessApp");
const Piece_1 = require("./Piece");
class Pawn extends Piece_1.Piece {
    constructor(x, y, team, cellList, pieceList) {
        var _a;
        super(x, y, team, cellList, pieceList);
        (_a = this.img) === null || _a === void 0 ? void 0 : _a.classList.add(`${Pawn.name}`);
        this.PieceType = ChessApp_1.PieceType.Pawn;
    }
    FindMovementAvailableCells() {
        let tempCellList = [];
        if (this.team == ChessApp_1.Team.North) {
            // todo : 확 줄여야함.
            let forwardOne = this.FindSouthCell(this.currentStandingCell);
            if (this.CheckSomeoneIsThere(forwardOne)) {
                if (!this.HasOpponentInCell(forwardOne)) {
                    if (forwardOne != undefined) {
                        tempCellList.push(forwardOne);
                        let forwardTwo = this.FindSouthCell(forwardOne);
                        if (this.CanMoveToCellWithAttack(forwardTwo)) {
                            if (!this.HasOpponentInCell(forwardTwo)) {
                                tempCellList.push(forwardTwo);
                            }
                        }
                    }
                }
            }
            let forwardRight = this.FindSouthWestCell(this.currentStandingCell);
            if (this.HasOpponentInCell(forwardRight)) {
                if (forwardRight != undefined) {
                    tempCellList.push(forwardRight);
                }
            }
            let forwardLeft = this.FindSouthEastCell(this.currentStandingCell);
            if (this.HasOpponentInCell(forwardLeft)) {
                if (forwardLeft != undefined) {
                    tempCellList.push(forwardLeft);
                }
            }
        }
        else {
            let forwardOne = this.FindNorthCell(this.currentStandingCell);
            if (this.CanMoveToCellWithAttack(forwardOne)) {
                if (!this.HasOpponentInCell(forwardOne)) {
                    tempCellList.push(forwardOne);
                    let forwardTwo = this.FindNorthCell(forwardOne);
                    if (this.CanMoveToCellWithAttack(forwardTwo)) {
                        if (!this.HasOpponentInCell(forwardTwo)) {
                            tempCellList.push(forwardTwo);
                        }
                    }
                }
            }
            let forwardRight = this.FindNorthEastCell(this.currentStandingCell);
            if (this.HasOpponentInCell(forwardRight)) {
                if (forwardRight != undefined) {
                    tempCellList.push(forwardRight);
                }
            }
            let forwardLeft = this.FindNorthWestCell(this.currentStandingCell);
            if (this.HasOpponentInCell(forwardLeft)) {
                if (forwardLeft != undefined) {
                    tempCellList.push(forwardLeft);
                }
            }
        }
        return tempCellList;
    }
}
exports.Pawn = Pawn;
