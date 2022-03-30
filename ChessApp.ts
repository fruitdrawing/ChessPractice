import { GameManager } from "./GameManager.js";

export enum GameState { Ready, StaringGame,SouthTeamTurn,NorthTeamTurn, End};
export enum GameState_PlayingState { WaitingForPieceSelection,WaitingForMovement,TurnFinishing};
export enum Team { South = "South", North = "North" };
export enum Direction { North, West, East, South, NorthWest,NorthEast,SouthWest,SouthEast};
export enum PieceType { Pawn, Knight, Bishop, Queen, King, Rook}


class ChessApp{
    gameManager : GameManager;
    constructor(){
        this.gameManager = new GameManager();
        this.gameManager.SpawnCells();
        this.gameManager.SpawnPieces();
    }
}

let chessApp : ChessApp;

(Init());

function Init() : void {
    chessApp = new ChessApp();
}

