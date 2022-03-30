import { Piece } from "./Piece";

export abstract class Command{
    constructor(){

    }
    abstract Execute() : void;
    abstract Undo() : void;
}

class MoveCommand extends Command{

    toX : number;
    toY : number;
    fromX : number;
    fromY : number;
    subject : Piece;
    constructor(piece : Piece,toX:number,toY:number){
        super();
        this.toX = toX;
        this.toY = toY;
        this.subject = piece;
        this.fromX = piece.x;
        this.fromY = piece.y;

    }
    Execute(): void {
        this.subject.Move(this.toX,this.toY);
    }
    Undo(): void {
    }
}