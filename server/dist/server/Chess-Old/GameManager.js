"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Cell_1 = require("./Cell");
const ChessApp_js_1 = require("./ChessApp.js");
const Pawn_js_1 = require("./Pawn.js");
const Rook_js_1 = require("./Rook.js");
const Knight_js_1 = require("./Knight.js");
const Bishop_js_1 = require("./Bishop.js");
const King_js_1 = require("./King.js");
class GameManager {
    constructor() {
        this.cellList = [];
        this.currentAvailableMovementCells = [];
        this.margin = 20;
        this.pieceList = [];
        this._commandList = [];
        this.mainDiv = document.getElementById('grid');
        this.turnStateHtmlText = document.getElementById('TurnStatus');
        this.winLostStateHtmlText = document.getElementById('WinText');
        this.startButton = document.getElementById('StartButton');
        // this.resetButton = document.getElementById('ResetButton')!;
        this.grid = document.getElementById('grid');
        this.CurrentGameState = ChessApp_js_1.GameState.Ready;
        this.currentTurnState = ChessApp_js_1.GameState_PlayingState.WaitingForPieceSelection;
        this.startButton.addEventListener('click', () => this.StartGame());
        // this.resetButton.addEventListener('click',() => this.ResetButton());
        // console.log(this.commandList);
    }
    get getCurrentGameState() {
        return this._currentGameState;
    }
    set CurrentGameState(value) {
        var _a, _b;
        switch (value) {
            case ChessApp_js_1.GameState.Ready:
                break;
            case ChessApp_js_1.GameState.StaringGame:
                this.startButton.setAttribute("stlye", "pointer-events: none");
                this.startButton.setAttribute("stlye", "opacity: 0.2");
                break;
            case ChessApp_js_1.GameState.NorthTeamTurn:
                this.currentPlayingTeam = ChessApp_js_1.Team.North;
                if (this.turnStateHtmlText) {
                    this.turnStateHtmlText.innerHTML = ChessApp_js_1.Team.North;
                }
                (_a = this.turnStateHtmlText) === null || _a === void 0 ? void 0 : _a.setAttribute("style", "color:aqua;");
                break;
            case ChessApp_js_1.GameState.SouthTeamTurn:
                this.currentPlayingTeam = ChessApp_js_1.Team.South;
                if (this.turnStateHtmlText) {
                    this.turnStateHtmlText.innerHTML = ChessApp_js_1.Team.South;
                }
                (_b = this.turnStateHtmlText) === null || _b === void 0 ? void 0 : _b.setAttribute("style", "color:orange;");
                break;
            case ChessApp_js_1.GameState.End:
                this.startButton.setAttribute("stlye", "pointer-events: auto");
                this.startButton.setAttribute("stlye", "opacity: 1");
                break;
        }
        this._currentGameState = value;
    }
    StartGame() {
        this.CurrentGameState = ChessApp_js_1.GameState.StaringGame;
        this.startButton.classList.remove("movementAvailableCell");
        //Random Start Team;
        if (Math.floor(Math.random()) == 0) {
            this.CurrentGameState = ChessApp_js_1.GameState.NorthTeamTurn;
        }
        else {
            this.CurrentGameState = ChessApp_js_1.GameState.SouthTeamTurn;
        }
    }
    EndGame() {
        //Animation
        this.CurrentGameState = ChessApp_js_1.GameState.End;
    }
    GameStateLogic() {
    }
    DoTurnLogic(cell) {
        switch (this.currentTurnState) {
            case ChessApp_js_1.GameState_PlayingState.WaitingForPieceSelection:
                if (!cell.CheckOccupied()) {
                    console.log("Empty Cell");
                    return;
                }
                else {
                    let piece = this.GetPieceFromCell(cell);
                    // this.pieceList.find(p => cell.x == p.x && cell.y == p.y)!;
                    if (piece.team == this.currentPlayingTeam) {
                        this.currentAvailableMovementCells = piece.FindMovementAvailableCells(this.cellList);
                        if (this.currentAvailableMovementCells != undefined
                            && this.currentAvailableMovementCells.length > 0) {
                            this.currentAvailableMovementCells.forEach(c => {
                                c.TurnOnMovementAvailableState();
                            });
                            this.currentSelectedPiece = piece;
                            this.currentTurnState = ChessApp_js_1.GameState_PlayingState.WaitingForMovement;
                        }
                        else {
                            console.log("This piece can't move...");
                        }
                    }
                }
                break;
            case ChessApp_js_1.GameState_PlayingState.WaitingForMovement:
                if (cell.IsAvailableMovementCell()) {
                    let targetPiece = this.GetPieceFromCell(cell);
                    if (targetPiece && targetPiece.team != this.currentSelectedPiece.team) {
                        // KILL
                        targetPiece.Die();
                        targetPiece = undefined;
                    }
                    this._commandList.push(this.currentSelectedPiece.Move(cell.x, cell.y));
                    this.ResetAllCellMovementAvailableState();
                    this.currentTurnState = ChessApp_js_1.GameState_PlayingState.TurnFinishing;
                    if (this.currentPlayingTeam == ChessApp_js_1.Team.South) {
                        this.CurrentGameState = ChessApp_js_1.GameState.NorthTeamTurn;
                    }
                    else {
                        this.CurrentGameState = ChessApp_js_1.GameState.SouthTeamTurn;
                    }
                    this.currentTurnState = ChessApp_js_1.GameState_PlayingState.WaitingForPieceSelection;
                    return;
                }
                else {
                    console.log("Select available cell!");
                }
                break;
        }
        // document.addEventListener('click', () => {})
        if (this.CheckWinState() != undefined) {
            console.log("Check Win State");
            this.SetWin(this.CheckWinState());
        }
    }
    SpawnCells() {
        for (let j = 0; j < 8; j++) {
            for (let i = 0; i < 8; i++) {
                let cellHTMLElement = document.createElement("button");
                let xRemainder = j % 2;
                let yRemainder = i % 2;
                if (yRemainder == 0) {
                    if (xRemainder == 0) {
                        cellHTMLElement.classList.add("cell-even");
                    }
                    else {
                        cellHTMLElement.classList.add("cell");
                    }
                }
                else {
                    if (xRemainder == 0) {
                        cellHTMLElement.classList.add("cell");
                    }
                    else {
                        cellHTMLElement.classList.add("cell-even");
                    }
                }
                cellHTMLElement.id = `${i},${j}`;
                cellHTMLElement.innerText = `${i},${j}`;
                let cell = new Cell_1.Cell(i, j, cellHTMLElement, this);
                this.cellList.push(cell);
                this.mainDiv.append(cellHTMLElement);
            }
        }
    }
    SpawnPieces() {
        this.pieceList.push(new Knight_js_1.Knight(1, 0, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(0, 1, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(1, 1, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(2, 1, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(3, 1, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(4, 1, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(5, 1, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(6, 1, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(7, 1, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new King_js_1.Queen(3, 0, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new King_js_1.King(4, 0, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Bishop_js_1.Bishop(2, 0, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Bishop_js_1.Bishop(5, 0, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Knight_js_1.Knight(6, 0, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Rook_js_1.Rook(0, 0, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Rook_js_1.Rook(7, 0, ChessApp_js_1.Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(0, 6, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(1, 6, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(2, 6, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(3, 6, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(4, 6, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(5, 6, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(6, 6, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn_js_1.Pawn(7, 6, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Knight_js_1.Knight(6, 7, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Rook_js_1.Rook(0, 7, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Rook_js_1.Rook(7, 7, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new King_js_1.King(3, 7, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Bishop_js_1.Bishop(2, 7, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Bishop_js_1.Bishop(5, 7, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new King_js_1.Queen(4, 7, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Knight_js_1.Knight(1, 7, ChessApp_js_1.Team.South, this.cellList, this.pieceList));
    }
    ReceiveCellButtonEvent(cell) {
        this.DoTurnLogic(cell);
    }
    GetPieceFromCell(cell) {
        return this.pieceList.find(p => p.x == cell.x && p.y == cell.y);
    }
    GameOver() {
    }
    ResetAllCellMovementAvailableState() {
        console.log("resetting");
        this.cellList.forEach(c => {
            if (c.HTMLElement.classList.contains("movementAvailableCell")) {
                c.HTMLElement.classList.remove("movementAvailableCell");
            }
        });
    }
    CheckWinState() {
        if (this.pieceList.filter(p => p.team == ChessApp_js_1.Team.North).length == 0) {
            return ChessApp_js_1.Team.South;
        }
        if (this.pieceList.filter(p => p.team == ChessApp_js_1.Team.South).length == 0) {
            return ChessApp_js_1.Team.North;
        }
        return undefined;
    }
    SetWin(team) {
        document.getElementById("WinText").innerHTML = team.toString();
        this.EndGame();
    }
    ResetButton() {
        this.DestroyAllPieces();
        this.DestroyAllCells();
        this.CurrentGameState = ChessApp_js_1.GameState.Ready;
        this.currentTurnState = ChessApp_js_1.GameState_PlayingState.WaitingForPieceSelection;
        this.currentSelectedPiece = undefined;
        this.SpawnCells();
        this.SpawnPieces();
    }
    DestroyAllPieces() {
        this.pieceList.forEach((piece) => {
            if (piece.img != null) {
                let node = piece.img.parentNode;
                node === null || node === void 0 ? void 0 : node.removeChild(piece.img);
            }
        });
        this.pieceList = [];
    }
    DestroyAllCells() {
        this.cellList.forEach((cell) => {
            if (cell.HTMLElement != null) {
                let node = cell.HTMLElement.parentNode;
                node.removeChild(cell.HTMLElement);
            }
        });
        this.cellList = [];
    }
    GetOppositeTeam(team) {
        if (team == ChessApp_js_1.Team.North) {
            return ChessApp_js_1.Team.South;
        }
        else {
            return ChessApp_js_1.Team.North;
        }
    }
}
exports.GameManager = GameManager;
