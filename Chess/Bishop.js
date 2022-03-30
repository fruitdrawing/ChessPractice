import { PieceType } from "./ChessApp.js";
import { Piece } from "./Piece.js";
export class Bishop extends Piece {
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
        super(x, y, team, cellList, pieceList);
        this.img.classList.add(`${Bishop.name}`);
        this.PieceType = PieceType.Bishop;
    }
}
