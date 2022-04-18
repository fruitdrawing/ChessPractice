"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveAttackCommand = exports.MoveCommand = exports.Command = void 0;
class Command {
    constructor() {
    }
}
exports.Command = Command;
class MoveCommand extends Command {
    constructor(piece, toX, toY) {
        super();
        this.toX = toX;
        this.toY = toY;
        this.pieceType = piece.PieceType;
        this.pieceRef = piece;
        this.fromX = piece.x;
        this.fromY = piece.y;
    }
    Execute() {
        this.pieceRef.Move(this.toX, this.toY);
    }
    Undo() {
    }
}
exports.MoveCommand = MoveCommand;
class MoveAttackCommand extends MoveCommand {
    constructor(piece, x, y) {
        super(piece, x, y);
    }
}
exports.MoveAttackCommand = MoveAttackCommand;
