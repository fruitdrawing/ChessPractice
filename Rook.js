import { PieceType } from "./ChessApp.js";
import { Piece } from "./Piece.js";
export class Rook extends Piece {
    FindMovementAvailableCells(cellList) {
        let teamCellList = [];
        let northCell = this.FindNorthCell(this.currentStandingCell);
        let westCell = this.FindWestCell(this.currentStandingCell);
        let eastCell = this.FindEastCell(this.currentStandingCell);
        let southCell = this.FindSouthCell(this.currentStandingCell);
        for (let i = 0; i < 8; i++) {
            if (northCell && this.CanMoveToCellWithAttack(northCell)) {
                teamCellList.push(northCell);
                northCell = this.FindNorthCell(northCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (westCell && this.CanMoveToCellWithAttack(westCell)) {
                teamCellList.push(westCell);
                westCell = this.FindWestCell(westCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (eastCell && this.CanMoveToCellWithAttack(eastCell)) {
                teamCellList.push(eastCell);
                eastCell = this.FindEastCell(eastCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southCell && this.CanMoveToCellWithAttack(southCell)) {
                teamCellList.push(southCell);
                southCell = this.FindSouthCell(southCell);
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
        this.img.classList.add(`${Rook.name}`);
        this.PieceType = PieceType.Rook;
    }
}
