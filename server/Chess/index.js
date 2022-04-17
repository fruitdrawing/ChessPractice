"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.ChessGameInfo = exports.Team = exports.GameState = exports.Vector2 = exports.PieceType = exports.Piece = exports.Cell = void 0;
var Cell_1 = require("./Cell");
__createBinding(exports, Cell_1, "Cell");
var Piece_1 = require("./Piece");
__createBinding(exports, Piece_1, "Piece");
__createBinding(exports, Piece_1, "PieceType");
var Vector2_1 = require("./Vector2");
__createBinding(exports, Vector2_1, "Vector2");
var GameState_1 = require("./GameState");
__createBinding(exports, GameState_1, "GameState");
var ChessEnum_1 = require("./ChessEnum");
__createBinding(exports, ChessEnum_1, "Team");
var ChessGameInfo_1 = require("./ChessGameInfo");
__createBinding(exports, ChessGameInfo_1, "ChessGameInfo");
