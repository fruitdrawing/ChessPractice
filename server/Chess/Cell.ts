import { Piece } from "./Piece";
import { Vector2 } from "./Vector2";
export class Cell {
    position: Vector2
    piece: Piece | undefined = undefined;

    constructor(x: number, y: number) {
        this.position = new Vector2(x, y);

    }
    GetStandingPiece(): Piece | undefined {
        return this.piece;
    }
    SetStandingPiece(piece: Piece | undefined): void {
        this.piece = piece;
    }
}