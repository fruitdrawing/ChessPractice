import { Team, PieceType } from "./ChessApp.js";
import { Piece } from "./Piece.js";
export class Pawn extends Piece {
    constructor(x, y, team, cellList, pieceList) {
        super(x, y, team, cellList, pieceList);
        this.img.classList.add(`${Pawn.name}`);
        this.PieceType = PieceType.Pawn;
    }
    FindMovementAvailableCells() {
        let tempCellList = [];
        if (this.team == Team.North) {
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
