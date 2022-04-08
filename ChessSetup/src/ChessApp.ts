import { GameManager } from "./GameManager";

export enum GameState { Ready, StaringGame,SouthTeamTurn,NorthTeamTurn, End};
export enum GameState_PlayingState { WaitingForPieceSelection,WaitingForMovement,TurnFinishing};
export enum Team { South = "South", North = "North" };
export enum Direction { North, West, East, South, NorthWest,NorthEast,SouthWest,SouthEast};
export enum PieceType { Pawn, Knight, Bishop, Queen, King, Rook}


export class ChessApp{
    gameManager : GameManager;
    constructor(){
        this.gameManager = new GameManager();
        this.gameManager.SpawnCells();
        this.gameManager.SpawnPieces();
    }
}

