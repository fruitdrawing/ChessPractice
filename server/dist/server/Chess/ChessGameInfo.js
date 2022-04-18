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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessGameInfo = void 0;
const ChessGame = __importStar(require("./index"));
class ChessGameInfo {
    constructor(hostSocketId, joinedUserSocketId) {
        this.CurrentTurn = ChessGame.Team.North;
        this.NorthTeamSocketId = "";
        this.SouthTeamSocketId = "";
        this.pieceList = [];
        this.cellList = [];
        this.grid = this.CreateServerGrid();
        this.CurrentAvailableCells = undefined;
        // 2d array 
        // [[rook,knight...],[pawn,pawn,pawn...],[undeifined,undo...],[],[],[],[pawn,pawn],[rook,knight]] 
        this.CurrentGameState = ChessGame.GameState.WaitingForPieceSelection;
        this.CommandList = [];
        this.NorthTeamSocketId = hostSocketId;
        this.SouthTeamSocketId = joinedUserSocketId;
        this.CurrentTurn = this.GetRandomTeam();
        this.CurrentAvailableCells = [];
        this.CurrentSelectedPiece = undefined;
        this.Init();
        // this.grid[0][1];
        // this.grid[3 + 1][3 + 1];
    }
    CreateServerGrid() {
        let output = [];
        for (let i = 0; i < 8; i++) {
            let column = [];
            for (let j = 0; j < 8; j++) {
                column.push(new ChessGame.Cell(i, j));
            }
            output.push(column);
        }
        return output;
    }
    SetCurrentSelectedPiece(piece) {
        this.CurrentSelectedPiece = piece;
    }
    GetRandomTeam() {
        if (Math.floor(Math.random()) == 0) {
            return ChessGame.Team.North;
        }
        else {
            return ChessGame.Team.South;
        }
    }
    Init() {
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(0, 1), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(1, 1), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(2, 1), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(3, 1), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(4, 1), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(5, 1), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(6, 1), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(7, 1), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(7, 0), ChessGame.Team.North, ChessGame.PieceType.Rook);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(0, 0), ChessGame.Team.North, ChessGame.PieceType.Rook);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(1, 0), ChessGame.Team.North, ChessGame.PieceType.Knight);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(6, 0), ChessGame.Team.North, ChessGame.PieceType.Knight);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(2, 0), ChessGame.Team.North, ChessGame.PieceType.Bishop);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(5, 0), ChessGame.Team.North, ChessGame.PieceType.Bishop);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(3, 0), ChessGame.Team.North, ChessGame.PieceType.King);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(4, 0), ChessGame.Team.North, ChessGame.PieceType.Queen);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(0, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(1, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(2, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(3, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(4, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(5, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(6, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(7, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(7, 7), ChessGame.Team.South, ChessGame.PieceType.Rook);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(0, 7), ChessGame.Team.South, ChessGame.PieceType.Rook);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(1, 7), ChessGame.Team.South, ChessGame.PieceType.Knight);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(6, 7), ChessGame.Team.South, ChessGame.PieceType.Knight);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(2, 7), ChessGame.Team.South, ChessGame.PieceType.Bishop);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(5, 7), ChessGame.Team.South, ChessGame.PieceType.Bishop);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(3, 7), ChessGame.Team.South, ChessGame.PieceType.Queen);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(4, 7), ChessGame.Team.South, ChessGame.PieceType.King);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(1, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
    }
    SetupGridByPositionTeamPiece(position, team, pieceType) {
        this.grid[position.x][position.y].SetStandingPiece(new ChessGame.Piece(team, pieceType, position));
    }
    // SetStandingPiece(board: Board, team: Team, pieceType: ChessGame.PieceType, position: ChessGame.Vector2) {
    //     board[position.x][position.y] = new ChessGame.Cell(team, pieceType, position);
    // }
    //@ts-ignore
    Move(piece, To, From) {
        var _a, _b;
        //Is it available?
        console.log('from', From);
        console.log('to', To);
        console.log('piece', piece);
        (_a = this.grid[From.position.x][From.position.y]) === null || _a === void 0 ? void 0 : _a.SetStandingPiece(undefined);
        piece.position = To.position;
        (_b = this.grid[To.position.x][To.position.y]) === null || _b === void 0 ? void 0 : _b.SetStandingPiece(piece);
        console.log(this.grid);
    }
    Kill() {
    }
    ToggleCurrentTurn() {
        if (this.CurrentTurn == ChessGame.Team.North) {
            this.CurrentTurn = ChessGame.Team.South;
        }
        else {
            this.CurrentTurn = ChessGame.Team.North;
        }
    }
    GetAvailableCells(team, piece) {
        console.log('GetAvailableCells called');
        let output;
        if (piece) {
            switch (piece.pieceType) {
                case ChessGame.PieceType.Pawn:
                    output = this.GetAvailableCellsByPawn(team, piece);
                    break;
                case ChessGame.PieceType.Bishop:
                    output = this.GetAvailableCellsByBishop(team, piece);
                    break;
                case ChessGame.PieceType.King:
                    output = this.GetAvailableCellsByKing(team, piece);
                    break;
                case ChessGame.PieceType.Queen:
                    output = this.GetAvailableCellsByQueen(team, piece);
                    break;
                case ChessGame.PieceType.Knight:
                    output = this.GetAvailableCellsByKnight(team, piece);
                    break;
                case ChessGame.PieceType.Rook:
                    output = this.GetAvailableCellsByRook(team, piece);
                    break;
            }
        }
        return output;
    }
    TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, cell, cellList) {
        let output = [];
        if (cell) {
            if (cell.piece) {
                if (cell.piece.team != team) {
                    output.push(cell);
                }
            }
            else {
                output.push(cell);
            }
        }
        cellList.push(...output);
    }
    TryAddCellForwardUntilEnd(team, fromCell, cellList, directionFunction) {
        let output = [];
        if (fromCell == null)
            return;
        let currentPosition = fromCell.position;
        for (let i = 0; i < 7; i++) {
            let nextCell = directionFunction(currentPosition);
            if (nextCell == null)
                break;
            if (nextCell.piece) {
                if (nextCell.piece.team == team)
                    break;
                else {
                    // * add opponoent standing cell
                    output.push(nextCell);
                    break;
                }
            }
            else {
                // * add empty cell
                output.push(nextCell);
                currentPosition = nextCell.position;
            }
        }
        cellList.push(...output);
    }
    GetAvailableCellsByQueen(team, piece) {
        let output = [];
        output.push(...this.GetAvailableCellsByBishop(team, piece));
        output.push(...this.GetAvailableCellsByRook(team, piece));
        return output;
    }
    GetAvailableCellsByKing(team, piece) {
        let output = [];
        let currentPosition = piece.position;
        this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetNorthCell(currentPosition), output);
        this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetNorthEastCell(currentPosition), output);
        this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetEastCell(currentPosition), output);
        this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetSouthEastCell(currentPosition), output);
        this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetSouthCell(currentPosition), output);
        this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetSouthWestCell(currentPosition), output);
        this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetWestCell(currentPosition), output);
        this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetNorthWestCell(currentPosition), output);
        return output;
    }
    GetAvailableCellsByKnight(team, piece) {
        let output = [];
        let currentPosition = piece.position;
        let nextCell = this.GetNorthCell(currentPosition);
        if (nextCell) {
            this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetNorthWestCell(nextCell.position), output);
            this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetNorthEastCell(nextCell.position), output);
        }
        nextCell = this.GetEastCell(currentPosition);
        if (nextCell) {
            this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetNorthEastCell(nextCell.position), output);
            this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetSouthEastCell(nextCell.position), output);
        }
        nextCell = this.GetSouthCell(currentPosition);
        if (nextCell) {
            this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetSouthWestCell(nextCell.position), output);
            this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetSouthEastCell(nextCell.position), output);
        }
        nextCell = this.GetWestCell(currentPosition);
        if (nextCell) {
            this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetNorthWestCell(nextCell.position), output);
            this.TryAddCellToCellListIfEmptyCellOrEnemyStanding(team, this.GetSouthWestCell(nextCell.position), output);
        }
        return output;
    }
    GetAvailableCellsByBishop(team, piece) {
        let output = [];
        let currentPosition = piece.position;
        // let cell: Cell = this.GetCellByPosition(currentPosition)!;
        // if(cell)
        // {
        // this.TryAddCellForwardUntilEnd(team, cell, output, this.GetNorthWestCell(currentPosition));
        // }
        for (let i = 0; i < 7; i++) {
            let northWestCell = this.GetNorthWestCell(currentPosition);
            if (northWestCell == null)
                break;
            if (northWestCell.piece) {
                if (northWestCell.piece.team == team)
                    break;
                else {
                    // * add opponoent standing cell
                    output.push(northWestCell);
                    break;
                }
            }
            else {
                // * add empty cell
                output.push(northWestCell);
                currentPosition = northWestCell.position;
            }
        }
        currentPosition = piece.position;
        for (let i = 0; i < 7; i++) {
            let northWestCell = this.GetNorthEastCell(currentPosition);
            if (northWestCell == null)
                break;
            if (northWestCell.piece) {
                if (northWestCell.piece.team == team)
                    break;
                else {
                    // * add opponoent standing cell
                    output.push(northWestCell);
                    break;
                }
            }
            else {
                // * add empty cell
                output.push(northWestCell);
                currentPosition = northWestCell.position;
            }
        }
        currentPosition = piece.position;
        for (let i = 0; i < 7; i++) {
            let nextCell = this.GetSouthEastCell(currentPosition);
            if (nextCell == null)
                break;
            if (nextCell.piece) {
                if (nextCell.piece.team == team)
                    break;
                else {
                    // * add opponoent standing cell
                    output.push(nextCell);
                    break;
                }
            }
            else {
                // * add empty cell
                output.push(nextCell);
                currentPosition = nextCell.position;
            }
        }
        currentPosition = piece.position;
        for (let i = 0; i < 7; i++) {
            let nextCell = this.GetSouthWestCell(currentPosition);
            if (nextCell == null)
                break;
            if (nextCell.piece) {
                if (nextCell.piece.team == team)
                    break;
                else {
                    // * add opponoent standing cell
                    output.push(nextCell);
                    break;
                }
            }
            else {
                // * add empty cell
                output.push(nextCell);
                currentPosition = nextCell.position;
            }
        }
        return output;
    }
    GetAvailableCellsByRook(team, piece) {
        let output = [];
        let currentPosition = piece.position;
        //* NORTH
        for (let i = 0; i < 7; i++) {
            let northCell = this.GetNorthCell(currentPosition);
            if (northCell == null)
                break;
            if (northCell.piece) {
                if (northCell.piece.team == team)
                    break;
                else {
                    // * add opponoent standing cell
                    output.push(northCell);
                    break;
                }
            }
            else {
                // * add empty cell
                output.push(northCell);
                currentPosition = northCell.position;
            }
        }
        // * WEST
        currentPosition = piece.position;
        for (let i = 0; i < 7; i++) {
            let westCell = this.GetWestCell(currentPosition);
            if (westCell == null)
                break;
            if (westCell.piece) {
                if (westCell.piece.team == team)
                    break;
                else {
                    // * add opponoent standing cell
                    output.push(westCell);
                    break;
                }
            }
            else {
                // * add empty cell
                output.push(westCell);
                currentPosition = westCell.position;
            }
        }
        currentPosition = piece.position;
        for (let i = 0; i < 7; i++) {
            let southCell = this.GetSouthCell(currentPosition);
            if (southCell == null)
                break;
            if (southCell.piece) {
                if (southCell.piece.team == team)
                    break;
                else {
                    // * add opponoent standing cell
                    output.push(southCell);
                    break;
                }
            }
            else {
                // * add empty cell
                output.push(southCell);
                currentPosition = southCell.position;
            }
        }
        currentPosition = piece.position;
        for (let i = 0; i < 7; i++) {
            let eastCell = this.GetEastCell(currentPosition);
            if (eastCell == null)
                break;
            if (eastCell.piece) {
                if (eastCell.piece.team == team)
                    break;
                else {
                    // * add opponoent standing cell
                    output.push(eastCell);
                    break;
                }
            }
            else {
                // * add empty cell
                output.push(eastCell);
                currentPosition = eastCell.position;
            }
        }
        return output;
    }
    // GetForwardCell(position: ChessGame.Vector2,fn: ((position:ChessGame.Vector2) => ChessGame.Cell | null)) : ChessGame.Cell | null
    // {
    // }
    GetAvailableCellsByPawn(team, piece) {
        let output = [];
        let currentCell = piece.position;
        if (team == ChessGame.Team.North) {
            // try get south cell
            let southCell = this.GetSouthCell(piece.position);
            if (southCell) {
                let southCellStandingPiece = southCell.GetStandingPiece();
                if (southCellStandingPiece) {
                    //stop
                }
                else {
                    output.push(southCell);
                    let southCellTwo = this.GetSouthCell(southCell.position);
                    if (southCellTwo) {
                        let southCellTwoStandingPiece = southCellTwo.GetStandingPiece();
                        if (southCellTwoStandingPiece) {
                        }
                        else {
                            output.push(southCellTwo);
                        }
                    }
                }
            }
            let southWestCell = this.GetSouthWestCell(piece.position);
            if (southWestCell) {
                let southWestCellStandingPiece = southWestCell.GetStandingPiece();
                if (southWestCellStandingPiece) {
                    if (southWestCellStandingPiece.team === ChessGame.Team.South) {
                        output.push(southWestCell);
                    }
                }
            }
            let southEastCell = this.GetSouthEastCell(piece.position);
            if (southEastCell) {
                let southEastCellStandingPiece = southEastCell.GetStandingPiece();
                if (southEastCellStandingPiece) {
                    if (southEastCellStandingPiece.team === ChessGame.Team.South) {
                        output.push(southEastCell);
                    }
                }
            }
        }
        else {
            // * if PAWN IS TEAM SOUTH
            let northCell = this.GetNorthCell(piece.position);
            if (northCell) {
                let southCellStandingPiece = northCell.GetStandingPiece();
                if (southCellStandingPiece) {
                    //stop
                }
                else {
                    output.push(northCell);
                    let northCellTwo = this.GetNorthCell(northCell.position);
                    if (northCellTwo) {
                        let southCellTwoStandingPiece = northCellTwo.GetStandingPiece();
                        if (southCellTwoStandingPiece) {
                        }
                        else {
                            output.push(northCellTwo);
                        }
                    }
                }
            }
            let northWestCell = this.GetNorthWestCell(piece.position);
            if (northWestCell) {
                let northWestCellStandingPiece = northWestCell.GetStandingPiece();
                if (northWestCellStandingPiece) {
                    if (northWestCellStandingPiece.team === ChessGame.Team.North) {
                        output.push(northWestCell);
                    }
                }
            }
            let northEastCell = this.GetNorthEastCell(piece.position);
            if (northEastCell) {
                let northEastCellStandingPiece = northEastCell.GetStandingPiece();
                if (northEastCellStandingPiece) {
                    if (northEastCellStandingPiece.team === ChessGame.Team.North) {
                        output.push(northEastCell);
                    }
                }
            }
        }
        console.log(output);
        return output;
    }
    GetSouthCell(position) {
        if (position.y == 7)
            return null;
        return this.grid[position.x][position.y + 1];
    }
    GetNorthCell(position) {
        if (position.y == 0)
            return null;
        return this.grid[position.x][position.y - 1];
    }
    GetNorthWestCell(position) {
        if (position.x == 0 || position.y == 0)
            return null;
        return this.grid[position.x - 1][position.y - 1];
    }
    GetNorthEastCell(position) {
        if (position.x == 7 || position.y == 0)
            return null;
        return this.grid[position.x + 1][position.y - 1];
    }
    GetSouthWestCell(position) {
        if (position.x == 0 || position.y == 7) {
            return null;
        }
        else {
            return this.grid[position.x - 1][position.y + 1];
        }
    }
    GetSouthEastCell(position) {
        if (position.x == 7 || position.y == 7)
            return null;
        return this.grid[position.x + 1][position.y + 1];
    }
    GetWestCell(position) {
        if (position.x == 0)
            return null;
        return this.grid[position.x - 1][position.y];
    }
    GetEastCell(position) {
        if (position.x == 7)
            return null;
        return this.grid[position.x + 1][position.y];
    }
    GetCellByPosition(position) {
        return this.grid[position.x][position.y];
    }
    GetTeamBySocket(socketId) {
        if (this.NorthTeamSocketId === socketId) {
            return ChessGame.Team.North;
        }
        else if (this.SouthTeamSocketId === socketId) {
            return ChessGame.Team.South;
        }
        else {
            return undefined;
        }
    }
}
exports.ChessGameInfo = ChessGameInfo;
