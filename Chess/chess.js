import { Cell } from './cell.js';
import { Pawn } from './Piece.js';
export class GameManager {
    constructor() {
        this.cellList = [];
        this.currentAvailableMovementCells = [];
        this.margin = 20;
        this.pieceList = [];
        this.mainDiv = document.getElementById('grid');
        this.turnStateHtmlText = document.getElementById('TurnStatus');
        this.winLostStateHtmlText = document.getElementById('WinText');
        this.startButton = document.getElementById('StartButton');
        this.resetButton = document.getElementById('ResetButton');
        this.grid = document.getElementById('grid');
        this.CurrentGameState = GameState.Ready;
        this.currentTurnState = GamePlayingState.WaitingForPieceSelection;
        this.startButton.addEventListener('click', () => this.StartGame());
        this.resetButton.addEventListener('click', () => this.ResetButton());
    }
    get getCurrentGameState() {
        return this._currentGameState;
    }
    set CurrentGameState(value) {
        switch (value) {
            case GameState.Ready:
                break;
            case GameState.StaringGame:
                this.startButton.setAttribute("stye", "pointer-events: none");
                this.startButton.setAttribute("stye", "opacity: 0.2");
                break;
            case GameState.NorthTeamTurn:
                this.currentPlayingTeam = Team.North;
                this.turnStateHtmlText.innerHTML = Team.North;
                this.turnStateHtmlText.setAttribute("style", "color:green;");
                break;
            case GameState.SouthTeamTurn:
                this.currentPlayingTeam = Team.South;
                this.turnStateHtmlText.innerHTML = Team.South;
                this.turnStateHtmlText.setAttribute("style", "color:orange;");
                break;
            case GameState.End:
                this.startButton.setAttribute("stye", "pointer-events: auto");
                this.startButton.setAttribute("stye", "opacity: 1");
                break;
        }
        this._currentGameState = value;
    }
    StartGame() {
        this.CurrentGameState = GameState.StaringGame;
        //Random Start Team;
        if (Math.floor(Math.random()) == 0) {
            this.CurrentGameState = GameState.NorthTeamTurn;
        }
        else {
            this.CurrentGameState = GameState.SouthTeamTurn;
        }
    }
    EndGame() {
        //Animation
        this.CurrentGameState = GameState.End;
    }
    GameStateLogic() {
    }
    DoTurnLogic(cell) {
        switch (this.currentTurnState) {
            case GamePlayingState.WaitingForPieceSelection:
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
                            this.currentTurnState = GamePlayingState.WaitingForMovement;
                        }
                        else {
                            console.log("This piece can't move...");
                        }
                    }
                }
                break;
            case GamePlayingState.WaitingForMovement:
                if (cell.IsAvailableMovementCell()) {
                    console.log("asd");
                    let targetPiece = this.GetPieceFromCell(cell);
                    if (cell.CheckOccupied() == true && targetPiece.team == this.currentSelectedPiece.team) {
                        // KILL
                        targetPiece.Die();
                    }
                    this.currentSelectedPiece.Move(cell.x, cell.y);
                    this.ResetAllCellMovementAvailableState();
                    this.currentTurnState = GamePlayingState.TurnFinishing;
                    if (this.currentPlayingTeam == Team.South) {
                        this.CurrentGameState = GameState.NorthTeamTurn;
                    }
                    else {
                        this.CurrentGameState = GameState.SouthTeamTurn;
                    }
                    this.currentTurnState = GamePlayingState.WaitingForPieceSelection;
                    return;
                }
                else {
                    console.log("Select available cell!");
                }
                break;
        }
        console.log(this.CheckWinState());
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
                let cell = new Cell(i, j, cellHTMLElement);
                this.cellList.push(cell);
                this.mainDiv.append(cellHTMLElement);
            }
        }
    }
    ReceiveCellButtonEvent(cell) {
        this.DoTurnLogic(cell);
    }
    GetPieceFromCell(cell) {
        return this.pieceList.find(p => p.x == cell.x && p.y == cell.y);
    }
    SpawnPieces() {
        let king = new Pawn(3, 0, Team.North, this.cellList, this.pieceList);
        this.pieceList.push(king);
        let knight = new Pawn(3, 7, Team.South, this.cellList, this.pieceList);
        this.pieceList.push(knight);
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
        console.log(this.pieceList);
        if (this.pieceList.filter(p => p.team == Team.North).length == 0) {
            return Team.South;
        }
        if (this.pieceList.filter(p => p.team == Team.South).length == 0) {
            return Team.North;
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
        this.CurrentGameState = GameState.Ready;
        this.currentTurnState = GamePlayingState.WaitingForPieceSelection;
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
        if (team == Team.North) {
            return Team.South;
        }
        else {
            return Team.North;
        }
    }
}
export var GameState;
(function (GameState) {
    GameState[GameState["Ready"] = 0] = "Ready";
    GameState[GameState["StaringGame"] = 1] = "StaringGame";
    GameState[GameState["SouthTeamTurn"] = 2] = "SouthTeamTurn";
    GameState[GameState["NorthTeamTurn"] = 3] = "NorthTeamTurn";
    GameState[GameState["End"] = 4] = "End";
})(GameState || (GameState = {}));
;
export var GamePlayingState;
(function (GamePlayingState) {
    GamePlayingState[GamePlayingState["WaitingForPieceSelection"] = 0] = "WaitingForPieceSelection";
    GamePlayingState[GamePlayingState["WaitingForMovement"] = 1] = "WaitingForMovement";
    GamePlayingState[GamePlayingState["TurnFinishing"] = 2] = "TurnFinishing";
})(GamePlayingState || (GamePlayingState = {}));
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
var chessApp;
export class ChessApp {
}
ChessApp.gameManager = new GameManager();
ChessApp.gameState = GameState.Ready;
ChessApp.gamePlayingState = GamePlayingState.WaitingForMovement;
(Init());
function Init() {
    chessApp = new ChessApp();
    ChessApp.gameManager.SpawnCells();
    ChessApp.gameManager.SpawnPieces();
}
function CellClickEvent(c) {
    console.log("asd");
}
(DebugGameManager());
function DebugGameManager() {
    let debugButton = document.getElementById("DebugButton");
    debugButton === null || debugButton === void 0 ? void 0 : debugButton.addEventListener('click', () => console.log(ChessApp.gameManager));
}
;
