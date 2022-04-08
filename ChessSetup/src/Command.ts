import { PieceType } from "./ChessApp";
import { Piece } from "./Piece";

export abstract class Command{
    constructor(){

    }
    abstract Execute() : void;
    abstract Undo() : void;
}


export class MoveCommand extends Command{

    toX : number;
    toY : number;
    fromX : number;
    fromY : number;
    pieceType? : PieceType;
    pieceRef : Piece;
    constructor(piece : Piece,toX:number,toY:number){
        super();
        this.toX = toX;
        this.toY = toY;
        this.pieceType = piece.PieceType;
        this.pieceRef = piece;
        this.fromX = piece.x;
        this.fromY = piece.y;

    }
    Execute(): void {
        this.pieceRef.Move(this.toX,this.toY);
    }
    Undo(): void {
    }
}



export class MoveAttackCommand extends MoveCommand{
    constructor(piece : Piece ,x:number,y:number)
    {
        super(piece,x,y);
    }
}
