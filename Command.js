export class Command {
    constructor() {
    }
}
class MoveCommand extends Command {
    constructor(piece, toX, toY) {
        super();
        this.toX = toX;
        this.toY = toY;
        this.subject = piece;
        this.fromX = piece.x;
        this.fromY = piece.y;
    }
    Execute() {
        this.subject.Move(this.toX, this.toY);
    }
    Undo() {
    }
}
