import { PieceType } from "./ChessApp.js";
import { Piece } from "./Piece.js";
export class Knight extends Piece {
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
        super(x, y, team, cellList, pieceList);
        this.img.classList.add(`${Knight.name}`);
        console.log("Knight is born");
        this.PieceType = PieceType.Knight;
    }
}
