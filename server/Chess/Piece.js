"use strict";
exports.__esModule = true;
exports.PieceType = exports.Piece = void 0;
var Piece = /** @class */ (function () {
    function Piece(team, pieceType, position) {
        this.team = team;
        this.pieceType = pieceType;
        this.position = position;
    }
    return Piece;
}());
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
