import { GameManager } from "./GameManager.js";
export var GameState;
(function (GameState) {
    GameState[GameState["Ready"] = 0] = "Ready";
    GameState[GameState["StaringGame"] = 1] = "StaringGame";
    GameState[GameState["SouthTeamTurn"] = 2] = "SouthTeamTurn";
    GameState[GameState["NorthTeamTurn"] = 3] = "NorthTeamTurn";
    GameState[GameState["End"] = 4] = "End";
})(GameState || (GameState = {}));
;
export var GameState_PlayingState;
(function (GameState_PlayingState) {
    GameState_PlayingState[GameState_PlayingState["WaitingForPieceSelection"] = 0] = "WaitingForPieceSelection";
    GameState_PlayingState[GameState_PlayingState["WaitingForMovement"] = 1] = "WaitingForMovement";
    GameState_PlayingState[GameState_PlayingState["TurnFinishing"] = 2] = "TurnFinishing";
})(GameState_PlayingState || (GameState_PlayingState = {}));
;
export var Team;
(function (Team) {
    Team["South"] = "South";
    Team["North"] = "North";
})(Team || (Team = {}));
;
export var Direction;
(function (Direction) {
    Direction[Direction["North"] = 0] = "North";
    Direction[Direction["West"] = 1] = "West";
    Direction[Direction["East"] = 2] = "East";
    Direction[Direction["South"] = 3] = "South";
    Direction[Direction["NorthWest"] = 4] = "NorthWest";
    Direction[Direction["NorthEast"] = 5] = "NorthEast";
    Direction[Direction["SouthWest"] = 6] = "SouthWest";
    Direction[Direction["SouthEast"] = 7] = "SouthEast";
})(Direction || (Direction = {}));
;
export var PieceType;
(function (PieceType) {
    PieceType[PieceType["Pawn"] = 0] = "Pawn";
    PieceType[PieceType["Knight"] = 1] = "Knight";
    PieceType[PieceType["Bishop"] = 2] = "Bishop";
    PieceType[PieceType["Queen"] = 3] = "Queen";
    PieceType[PieceType["King"] = 4] = "King";
    PieceType[PieceType["Rook"] = 5] = "Rook";
})(PieceType || (PieceType = {}));
class ChessApp {
    constructor() {
        this.gameManager = new GameManager();
        this.gameManager.SpawnCells();
        this.gameManager.SpawnPieces();
    }
}
let chessApp;
(Init());
function Init() {
    chessApp = new ChessApp();
}
