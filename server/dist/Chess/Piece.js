"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieceType = exports.Piece = void 0;
class Piece {
    constructor(team, pieceType, position) {
        this.team = team;
        this.pieceType = pieceType;
        this.position = position;
    }
}
exports.Piece = Piece;
var PieceType;
(function (PieceType) {
    PieceType["Pawn"] = "Pawn";
    PieceType["Knight"] = "Knight";
    PieceType["Rook"] = "Rook";
    PieceType["Bishop"] = "Bishop";
    PieceType["Queen"] = "Queen";
    PieceType["King"] = "King";
})(PieceType = exports.PieceType || (exports.PieceType = {}));
