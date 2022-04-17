"use strict";
exports.__esModule = true;
exports.GameState = void 0;
var GameState;
(function (GameState) {
    GameState[GameState["WaitingForPieceSelection"] = 0] = "WaitingForPieceSelection";
    GameState[GameState["WaitingForAvailableCellClickToMove"] = 1] = "WaitingForAvailableCellClickToMove";
    GameState[GameState["Moving"] = 2] = "Moving";
})(GameState = exports.GameState || (exports.GameState = {}));
