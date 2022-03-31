'use strict';

try{if(!exports){exports = {};} }catch(e){var exports = {}};

class Cell {
    constructor(x, y, button, gameManager) {
        this.IsOccupied = false;
        this.x = x;
        this.y = y;
        this.id = `${x},${y}`;
        this.HTMLElement = button;
        this.HTMLElement.classList.add('cell');
        this.gameManageRef = gameManager;
        let clickFn = this.OnClick.bind(this);
        this.HTMLElement.addEventListener('click', clickFn);
    }
    OnClick(event) {
        console.log("On Clicked");
        this.gameManageRef.ReceiveCellButtonEvent(this);
    }
    TurnOnMovementAvailableState() {
        if (this.HTMLElement.classList.contains('movementAvailableCell')) {
            return;
        }
        else {
            this.HTMLElement.classList.add('movementAvailableCell');
        }
    }
    TurnOffMovementAvailableState() {
        if (this.HTMLElement.classList.contains('movementAvailableCell')) {
            this.HTMLElement.classList.remove('movementAvailableCell');
        }
        else {
            return;
        }
    }
    SetOccupied(bool) {
        this.IsOccupied = bool;
    }
    CheckOccupied() {
        return this.IsOccupied;
    }
    IsAvailableMovementCell() {
        return this.HTMLElement.classList.contains('movementAvailableCell');
    }
}

class Command {
    constructor() {
    }
}
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

class Piece {
    constructor(x, y, team, cellList, pieceList) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.cellListRef = cellList;
        this.pieceListRef = pieceList;
        this.SetupHTMLElement(x, y, team);
        this.Move(x, y);
    }
    SetupHTMLElement(x, y, team) {
        this.cellListRef.find(e => e.id == `${x},${y}`);
        this.img = document.createElement("img");
        this.img.classList.add("Piece");
        var cell = document.getElementById(`${x},${y}`);
        cell.append(this.img);
        this.img.classList.add(team.toString() + "Team");
    }
    Move(x, y) {
        let oldStandingCell = this.cellListRef.find(e => e.id == `${this.x},${this.y}`);
        let newStandingCell = this.cellListRef.find(e => e.id == `${x},${y}`);
        if (!this.CanMoveToCellWithAttack(newStandingCell)) {
            console.log("Movement Failed!");
            return undefined;
        }
        else {
            let newParent = document.getElementById(`${x},${y}`);
            newParent === null || newParent === void 0 ? void 0 : newParent.appendChild(this.img);
            this.x = x;
            this.y = y;
            oldStandingCell.SetOccupied(false);
            // oldStandingCell.StandingPiece = undefined;
            // newStandingCell.StandingPiece = this;
            newStandingCell.SetOccupied(true);
            this.currentStandingCell = newStandingCell;
            console.log("Move Success");
            return new MoveCommand(this, this.x, this.y);
        }
    }
    Kill(piece) {
        piece.Die();
    }
    Die() {
        // this.currentStandingCell.SetOccupied(false);
        this.img.remove();
        console.log("Dead ! !");
    }
    FindNorthCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x) && (e.y == cell.y - 1));
        return foundCell;
    }
    FindWestCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x - 1) && (e.y == cell.y));
        return foundCell;
    }
    FindEastCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x + 1) && (e.y == cell.y));
        return foundCell;
    }
    FindSouthCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x) && (e.y == cell.y + 1));
        return foundCell;
    }
    FindNorthWestCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x - 1) && (e.y == cell.y - 1));
        return foundCell;
    }
    FindNorthEastCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x + 1) && (e.y == cell.y - 1));
        return foundCell;
    }
    FindSouthWestCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x - 1) && (e.y == cell.y + 1));
        return foundCell;
    }
    FindSouthEastCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x + 1) && (e.y == cell.y + 1));
        return foundCell;
    }
    // InvertDirectionByTeam(team:Team,direction:Direction) : Direction
    // {
    //     if(team == Team.South)
    //     {
    //         switch(direction){
    //             case Direction.South:
    //                 break;
    //             case Direction.North:
    //                 break;
    //             case Direction.East:
    //                 return Direction.West;
    //             case 
    //             }
    //     }
    // }
    CheckSomeoneIsThere(toCell) {
        if (!toCell)
            return false;
        //
        if (toCell.CheckOccupied() == true || toCell == undefined) {
            return false;
        }
        return true;
    }
    CanMoveToCellWithAttack(cell) {
        if (!cell)
            return false;
        if (cell.CheckOccupied()) {
            let stnadingPiece = this.pieceListRef.find(p => p.x == cell.x && p.y == cell.y);
            if (stnadingPiece.team == this.team) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    HasOpponentInCell(cell) {
        if (!cell)
            return false;
        if (cell.CheckOccupied()) {
            let standingPiece = this.pieceListRef.find(p => p.x == cell.x && p.y == cell.y);
            if (standingPiece.team != this.team)
                return true;
        }
        return false;
    }
}

class Pawn extends Piece {
    constructor(x, y, team, cellList, pieceList) {
        super(x, y, team, cellList, pieceList);
        this.img.classList.add(`${Pawn.name}`);
        this.PieceType = PieceType.Pawn;
    }
    FindMovementAvailableCells() {
        let tempCellList = [];
        if (this.team == Team.North) {
            // todo : 확 줄여야함.
            let forwardOne = this.FindSouthCell(this.currentStandingCell);
            if (this.CheckSomeoneIsThere(forwardOne)) {
                if (!this.HasOpponentInCell(forwardOne)) {
                    if (forwardOne != undefined) {
                        tempCellList.push(forwardOne);
                        let forwardTwo = this.FindSouthCell(forwardOne);
                        if (this.CanMoveToCellWithAttack(forwardTwo)) {
                            if (!this.HasOpponentInCell(forwardTwo)) {
                                tempCellList.push(forwardTwo);
                            }
                        }
                    }
                }
            }
            let forwardRight = this.FindSouthWestCell(this.currentStandingCell);
            if (this.HasOpponentInCell(forwardRight)) {
                if (forwardRight != undefined) {
                    tempCellList.push(forwardRight);
                }
            }
            let forwardLeft = this.FindSouthEastCell(this.currentStandingCell);
            if (this.HasOpponentInCell(forwardLeft)) {
                if (forwardLeft != undefined) {
                    tempCellList.push(forwardLeft);
                }
            }
        }
        else {
            let forwardOne = this.FindNorthCell(this.currentStandingCell);
            if (this.CanMoveToCellWithAttack(forwardOne)) {
                if (!this.HasOpponentInCell(forwardOne)) {
                    tempCellList.push(forwardOne);
                    let forwardTwo = this.FindNorthCell(forwardOne);
                    if (this.CanMoveToCellWithAttack(forwardTwo)) {
                        if (!this.HasOpponentInCell(forwardTwo)) {
                            tempCellList.push(forwardTwo);
                        }
                    }
                }
            }
            let forwardRight = this.FindNorthEastCell(this.currentStandingCell);
            if (this.HasOpponentInCell(forwardRight)) {
                if (forwardRight != undefined) {
                    tempCellList.push(forwardRight);
                }
            }
            let forwardLeft = this.FindNorthWestCell(this.currentStandingCell);
            if (this.HasOpponentInCell(forwardLeft)) {
                if (forwardLeft != undefined) {
                    tempCellList.push(forwardLeft);
                }
            }
        }
        return tempCellList;
    }
}

class Rook extends Piece {
    FindMovementAvailableCells(cellList) {
        let teamCellList = [];
        let northCell = this.FindNorthCell(this.currentStandingCell);
        let westCell = this.FindWestCell(this.currentStandingCell);
        let eastCell = this.FindEastCell(this.currentStandingCell);
        let southCell = this.FindSouthCell(this.currentStandingCell);
        for (let i = 0; i < 8; i++) {
            if (northCell && this.CanMoveToCellWithAttack(northCell)) {
                teamCellList.push(northCell);
                northCell = this.FindNorthCell(northCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (westCell && this.CanMoveToCellWithAttack(westCell)) {
                teamCellList.push(westCell);
                westCell = this.FindWestCell(westCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (eastCell && this.CanMoveToCellWithAttack(eastCell)) {
                teamCellList.push(eastCell);
                eastCell = this.FindEastCell(eastCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southCell && this.CanMoveToCellWithAttack(southCell)) {
                teamCellList.push(southCell);
                southCell = this.FindSouthCell(southCell);
                continue;
            }
            else {
                break;
            }
        }
        return teamCellList;
    }
    constructor(x, y, team, cellList, pieceList) {
        super(x, y, team, cellList, pieceList);
        this.img.classList.add(`${Rook.name}`);
        this.PieceType = PieceType.Rook;
    }
}

class Knight extends Piece {
    FindMovementAvailableCells() {
        let teamCellList = [];
        let northCell = this.FindNorthCell(this.currentStandingCell);
        let westCell = this.FindWestCell(this.currentStandingCell);
        let southCell = this.FindSouthCell(this.currentStandingCell);
        let eastCell = this.FindEastCell(this.currentStandingCell);
        if (northCell) {
            let northNorthWestCell = this.FindNorthWestCell(northCell);
            let northNorthEastCell = this.FindNorthEastCell(northCell);
            if (northNorthWestCell && this.CanMoveToCellWithAttack(northNorthWestCell))
                teamCellList.push(northNorthWestCell);
            if (northNorthEastCell && this.CanMoveToCellWithAttack(northNorthEastCell))
                teamCellList.push(northNorthEastCell);
        }
        if (westCell) {
            let westNorthWestCell = this.FindNorthWestCell(westCell);
            let westSouthWestCell = this.FindSouthWestCell(westCell);
            if (westNorthWestCell) {
                if (this.CanMoveToCellWithAttack(westNorthWestCell)) {
                    teamCellList.push(westNorthWestCell);
                }
            }
            if (westSouthWestCell) {
                if (this.CanMoveToCellWithAttack(westSouthWestCell)) {
                    teamCellList.push(westSouthWestCell);
                }
            }
        }
        if (southCell) {
            let southSouthWestCell = this.FindSouthWestCell(southCell);
            let southSouthEastCell = this.FindSouthEastCell(southCell);
            if (southSouthWestCell) {
                if (this.CanMoveToCellWithAttack(southSouthWestCell)) {
                    teamCellList.push(southSouthWestCell);
                }
            }
            if (southSouthEastCell) {
                if (this.CanMoveToCellWithAttack(southSouthEastCell)) {
                    teamCellList.push(southSouthEastCell);
                }
            }
        }
        if (eastCell) {
            let eastNorthEastCell = this.FindNorthEastCell(eastCell);
            let eastSouthEastCell = this.FindSouthEastCell(eastCell);
            if (eastNorthEastCell) {
                if (this.CanMoveToCellWithAttack(eastNorthEastCell)) {
                    teamCellList.push(eastNorthEastCell);
                }
            }
            if (eastSouthEastCell) {
                if (this.CanMoveToCellWithAttack(eastSouthEastCell)) {
                    teamCellList.push(eastSouthEastCell);
                }
            }
        }
        return teamCellList;
    }
    constructor(x, y, team, cellList, pieceList) {
        super(x, y, team, cellList, pieceList);
        this.img.classList.add(`${Knight.name}`);
        console.log("Knight is born");
        this.PieceType = PieceType.Knight;
    }
}

class Bishop extends Piece {
    FindMovementAvailableCells() {
        let teamCellList = [];
        let northWestCell = this.FindNorthWestCell(this.currentStandingCell);
        let northEastCell = this.FindNorthEastCell(this.currentStandingCell);
        let southWestCell = this.FindSouthWestCell(this.currentStandingCell);
        let southEastCell = this.FindSouthEastCell(this.currentStandingCell);
        for (let i = 0; i < 8; i++) {
            if (northWestCell && this.CanMoveToCellWithAttack(northWestCell)) {
                teamCellList.push(northWestCell);
                northWestCell = this.FindNorthWestCell(northWestCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (northEastCell && this.CanMoveToCellWithAttack(northEastCell)) {
                teamCellList.push(northEastCell);
                northEastCell = this.FindNorthEastCell(northEastCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southWestCell && this.CanMoveToCellWithAttack(southWestCell)) {
                teamCellList.push(southWestCell);
                southWestCell = this.FindSouthWestCell(southWestCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southEastCell && this.CanMoveToCellWithAttack(southEastCell)) {
                teamCellList.push(southEastCell);
                southEastCell = this.FindSouthEastCell(southEastCell);
                continue;
            }
            else {
                break;
            }
        }
        return teamCellList;
    }
    constructor(x, y, team, cellList, pieceList) {
        super(x, y, team, cellList, pieceList);
        this.img.classList.add(`${Bishop.name}`);
        this.PieceType = PieceType.Bishop;
    }
}

class Queen extends Piece {
    FindMovementAvailableCells(cellList) {
        let teamCellList = [];
        let northCell = this.FindNorthCell(this.currentStandingCell);
        let westCell = this.FindWestCell(this.currentStandingCell);
        let eastCell = this.FindEastCell(this.currentStandingCell);
        let southCell = this.FindSouthCell(this.currentStandingCell);
        for (let i = 0; i < 8; i++) {
            if (northCell && this.CanMoveToCellWithAttack(northCell)) {
                teamCellList.push(northCell);
                northCell = this.FindNorthCell(northCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (westCell && this.CanMoveToCellWithAttack(westCell)) {
                teamCellList.push(westCell);
                westCell = this.FindWestCell(westCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (eastCell && this.CanMoveToCellWithAttack(eastCell)) {
                teamCellList.push(eastCell);
                eastCell = this.FindEastCell(eastCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southCell && this.CanMoveToCellWithAttack(southCell)) {
                teamCellList.push(southCell);
                southCell = this.FindSouthCell(southCell);
                continue;
            }
            else {
                break;
            }
        }
        let northWestCell = this.FindNorthWestCell(this.currentStandingCell);
        let northEastCell = this.FindNorthEastCell(this.currentStandingCell);
        let southWestCell = this.FindSouthWestCell(this.currentStandingCell);
        let southEastCell = this.FindSouthEastCell(this.currentStandingCell);
        for (let i = 0; i < 8; i++) {
            if (northWestCell && this.CanMoveToCellWithAttack(northWestCell)) {
                teamCellList.push(northWestCell);
                northWestCell = this.FindNorthWestCell(northWestCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (northEastCell && this.CanMoveToCellWithAttack(northEastCell)) {
                teamCellList.push(northEastCell);
                northEastCell = this.FindNorthEastCell(northEastCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southWestCell && this.CanMoveToCellWithAttack(southWestCell)) {
                teamCellList.push(southWestCell);
                southWestCell = this.FindSouthWestCell(southWestCell);
                continue;
            }
            else {
                break;
            }
        }
        for (let i = 0; i < 8; i++) {
            if (southEastCell && this.CanMoveToCellWithAttack(southEastCell)) {
                teamCellList.push(southEastCell);
                southEastCell = this.FindSouthEastCell(southEastCell);
                continue;
            }
            else {
                break;
            }
        }
        return teamCellList;
    }
    constructor(x, y, team, cellList, pieceList) {
        super(x, y, team, cellList, pieceList);
        this.img.classList.add(`${Queen
            .name}`);
        this.PieceType = PieceType.Queen;
    }
}
class King extends Piece {
    FindMovementAvailableCells() {
        let teamCellList = [];
        let northCell = this.FindNorthCell(this.currentStandingCell);
        let northWestCell = this.FindNorthWestCell(this.currentStandingCell);
        let northEastCell = this.FindNorthEastCell(this.currentStandingCell);
        let eastCell = this.FindEastCell(this.currentStandingCell);
        let westCell = this.FindWestCell(this.currentStandingCell);
        let southCell = this.FindSouthCell(this.currentStandingCell);
        let southWestCell = this.FindSouthWestCell(this.currentStandingCell);
        let southEastCell = this.FindSouthEastCell(this.currentStandingCell);
        if (northCell) {
            if (this.CanMoveToCellWithAttack(northCell))
                teamCellList.push(northCell);
        }
        if (northWestCell && this.CanMoveToCellWithAttack(northWestCell))
            teamCellList.push(northWestCell);
        if (northEastCell && this.CanMoveToCellWithAttack(northEastCell))
            teamCellList.push(northEastCell);
        if (eastCell && this.CanMoveToCellWithAttack(eastCell))
            teamCellList.push(eastCell);
        if (westCell && this.CanMoveToCellWithAttack(westCell))
            teamCellList.push(westCell);
        if (southCell && this.CanMoveToCellWithAttack(southCell))
            teamCellList.push(southCell);
        if (southWestCell && this.CanMoveToCellWithAttack(southWestCell))
            teamCellList.push(southWestCell);
        if (southEastCell && this.CanMoveToCellWithAttack(southEastCell))
            teamCellList.push(southEastCell);
        return teamCellList;
    }
    constructor(x, y, team, cellList, pieceList) {
        super(x, y, team, cellList, pieceList);
        this.img.classList.add(`${King.name}`);
        this.PieceType = PieceType.King;
    }
}

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
        this.resetButton = document.getElementById('ResetButton');
        this.grid = document.getElementById('grid');
        this.CurrentGameState = GameState.Ready;
        this.currentTurnState = GameState_PlayingState.WaitingForPieceSelection;
        this.startButton.addEventListener('click', () => this.StartGame());
        this.resetButton.addEventListener('click', () => this.ResetButton());
        // console.log(this.commandList);
    }
    get getCurrentGameState() {
        return this._currentGameState;
    }
    set CurrentGameState(value) {
        switch (value) {
            case GameState.Ready:
                break;
            case GameState.StaringGame:
                this.startButton.setAttribute("stlye", "pointer-events: none");
                this.startButton.setAttribute("stlye", "opacity: 0.2");
                break;
            case GameState.NorthTeamTurn:
                this.currentPlayingTeam = Team.North;
                this.turnStateHtmlText.innerHTML = Team.North;
                this.turnStateHtmlText.setAttribute("style", "color:aqua;");
                break;
            case GameState.SouthTeamTurn:
                this.currentPlayingTeam = Team.South;
                this.turnStateHtmlText.innerHTML = Team.South;
                this.turnStateHtmlText.setAttribute("style", "color:orange;");
                break;
            case GameState.End:
                this.startButton.setAttribute("stlye", "pointer-events: auto");
                this.startButton.setAttribute("stlye", "opacity: 1");
                break;
        }
        this._currentGameState = value;
    }
    StartGame() {
        this.CurrentGameState = GameState.StaringGame;
        this.startButton.classList.remove("movementAvailableCell");
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
            case GameState_PlayingState.WaitingForPieceSelection:
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
                            this.currentTurnState = GameState_PlayingState.WaitingForMovement;
                        }
                        else {
                            console.log("This piece can't move...");
                        }
                    }
                }
                break;
            case GameState_PlayingState.WaitingForMovement:
                if (cell.IsAvailableMovementCell()) {
                    let targetPiece = this.GetPieceFromCell(cell);
                    if (targetPiece && targetPiece.team != this.currentSelectedPiece.team) {
                        // KILL
                        targetPiece.Die();
                        targetPiece = undefined;
                    }
                    this._commandList.push(this.currentSelectedPiece.Move(cell.x, cell.y));
                    this.ResetAllCellMovementAvailableState();
                    this.currentTurnState = GameState_PlayingState.TurnFinishing;
                    if (this.currentPlayingTeam == Team.South) {
                        this.CurrentGameState = GameState.NorthTeamTurn;
                    }
                    else {
                        this.CurrentGameState = GameState.SouthTeamTurn;
                    }
                    this.currentTurnState = GameState_PlayingState.WaitingForPieceSelection;
                    return;
                }
                else {
                    console.log("Select available cell!");
                }
                break;
        }
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
                let cell = new Cell(i, j, cellHTMLElement, this);
                this.cellList.push(cell);
                this.mainDiv.append(cellHTMLElement);
            }
        }
    }
    SpawnPieces() {
        this.pieceList.push(new Knight(1, 0, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(0, 1, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(1, 1, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(2, 1, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(3, 1, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(4, 1, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(5, 1, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(6, 1, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(7, 1, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Queen(3, 0, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new King(4, 0, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Bishop(2, 0, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Bishop(5, 0, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Knight(6, 0, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Rook(0, 0, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Rook(7, 0, Team.North, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(0, 6, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(1, 6, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(2, 6, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(3, 6, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(4, 6, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(5, 6, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(6, 6, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Pawn(7, 6, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Knight(6, 7, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Rook(0, 7, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Rook(7, 7, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new King(3, 7, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Bishop(2, 7, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Bishop(5, 7, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Queen(4, 7, Team.South, this.cellList, this.pieceList));
        this.pieceList.push(new Knight(1, 7, Team.South, this.cellList, this.pieceList));
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
        this.currentTurnState = GameState_PlayingState.WaitingForPieceSelection;
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
// (DebugGameManager());
// function DebugGameManager() : void {
//     let debugButton = document.getElementById("DebugButton");
//     debugButton?.addEventListener('click',() => console.log(ChessApp.gameManager));
// };

var GameState;
(function (GameState) {
    GameState[GameState["Ready"] = 0] = "Ready";
    GameState[GameState["StaringGame"] = 1] = "StaringGame";
    GameState[GameState["SouthTeamTurn"] = 2] = "SouthTeamTurn";
    GameState[GameState["NorthTeamTurn"] = 3] = "NorthTeamTurn";
    GameState[GameState["End"] = 4] = "End";
})(GameState || (GameState = {}));
var GameState_PlayingState;
(function (GameState_PlayingState) {
    GameState_PlayingState[GameState_PlayingState["WaitingForPieceSelection"] = 0] = "WaitingForPieceSelection";
    GameState_PlayingState[GameState_PlayingState["WaitingForMovement"] = 1] = "WaitingForMovement";
    GameState_PlayingState[GameState_PlayingState["TurnFinishing"] = 2] = "TurnFinishing";
})(GameState_PlayingState || (GameState_PlayingState = {}));
var Team;
(function (Team) {
    Team["South"] = "South";
    Team["North"] = "North";
})(Team || (Team = {}));
var Direction;
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
var PieceType;
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

const chessApp = new ChessApp();

module.exports = chessApp;
//# sourceMappingURL=bundle.js.map
