import { Team } from './ChessEnum'
import { Vector2 } from './Vector2';

export class Piece {
    team: Team
    pieceType: PieceType;
    position: Vector2;
    constructor(team: Team, pieceType: PieceType, position: Vector2) {
        this.team = team;
        this.pieceType = pieceType;
        this.position = position;
    }
}


export enum PieceType {
    Pawn = "Pawn",
    Knight = "Knight",
    Rook = "Rook",
    Bishop = "Bishop",
    Queen = "Queen",
    King = "King"
}