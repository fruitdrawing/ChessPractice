"use strict";
exports.__esModule = true;
exports.ChessGameInfo = void 0;
var ChessGame = require("./index");
var ChessGameInfo = /** @class */ (function () {
    function ChessGameInfo(hostSocketId, joinedUserSocketId) {
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
    ChessGameInfo.prototype.CreateServerGrid = function () {
        var output = [];
        for (var i = 0; i < 8; i++) {
            var column = [];
            for (var j = 0; j < 8; j++) {
                column.push(new ChessGame.Cell(i, j));
            }
            output.push(column);
        }
        return output;
    };
    ChessGameInfo.prototype.SetCurrentSelectedPiece = function (piece) {
        this.CurrentSelectedPiece = piece;
    };
    ChessGameInfo.prototype.GetRandomTeam = function () {
        if (Math.floor(Math.random()) == 0) {
            return ChessGame.Team.North;
        }
        else {
            return ChessGame.Team.South;
        }
    };
    ChessGameInfo.prototype.Init = function () {
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(0, 0), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(1, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);
    };
    ChessGameInfo.prototype.SetupGridByPositionTeamPiece = function (position, team, pieceType) {
        this.grid[position.x][position.y].SetStandingPiece(new ChessGame.Piece(team, pieceType, position));
    };
    // SetStandingPiece(board: Board, team: Team, pieceType: ChessGame.PieceType, position: ChessGame.Vector2) {
    //     board[position.x][position.y] = new ChessGame.Cell(team, pieceType, position);
    // }
    //@ts-ignore
    ChessGameInfo.prototype.Move = function (piece, To, From) {
        var _a, _b;
        //Is it available?
        console.log('from', From);
        console.log('to', To);
        console.log('piece', piece);
        (_a = this.grid[From.position.x][From.position.y]) === null || _a === void 0 ? void 0 : _a.SetStandingPiece(undefined);
        piece.position = To.position;
        (_b = this.grid[To.position.x][To.position.y]) === null || _b === void 0 ? void 0 : _b.SetStandingPiece(piece);
        console.log(this.grid);
    };
    ChessGameInfo.prototype.Kill = function () {
    };
    ChessGameInfo.prototype.ToggleCurrentTurn = function () {
        if (this.CurrentTurn == ChessGame.Team.North) {
            this.CurrentTurn = ChessGame.Team.South;
        }
        else {
            this.CurrentTurn = ChessGame.Team.North;
        }
    };
    ChessGameInfo.prototype.GetAvailableCells = function (team, piece) {
        console.log('GetAvailableCells called');
        var output;
        if (piece) {
            switch (piece.pieceType) {
                case ChessGame.PieceType.Pawn:
                    output = this.GetAvailableCellsByPawn(team, piece);
                    break;
                case ChessGame.PieceType.Bishop:
                    break;
                case ChessGame.PieceType.King:
                    break;
            }
        }
        return output;
    };
    ChessGameInfo.prototype.GetAvailableCellsByPawn = function (team, piece) {
        var output = [];
        var currentCell = piece.position;
        if (team == ChessGame.Team.North) {
            // try get south cell
            var southCell = this.GetSouthCell(piece.position);
            if (southCell) {
                var southCellStandingPiece = southCell.GetStandingPiece();
                if (southCellStandingPiece) {
                    //stop
                }
                else {
                    output.push(southCell);
                    var southCellTwo = this.GetSouthCell(southCell.position);
                    if (southCellTwo) {
                        var southCellTwoStandingPiece = southCellTwo.GetStandingPiece();
                        if (southCellTwoStandingPiece) {
                        }
                        else {
                            output.push(southCellTwo);
                        }
                    }
                }
            }
            var southWestCell = this.GetSouthWestCell(piece.position);
            if (southWestCell) {
                var southWestCellStandingPiece = southWestCell.GetStandingPiece();
                if (southWestCellStandingPiece) {
                    if (southWestCellStandingPiece.team === ChessGame.Team.South) {
                        output.push(southWestCell);
                    }
                }
            }
            var southEastCell = this.GetSouthEastCell(piece.position);
            if (southEastCell) {
                var southEastCellStandingPiece = southEastCell.GetStandingPiece();
                if (southEastCellStandingPiece) {
                    if (southEastCellStandingPiece.team === ChessGame.Team.South) {
                        output.push(southEastCell);
                    }
                }
            }
        }
        else {
            // * if PAWN IS TEAM SOUTH
            var northCell = this.GetNorthCell(piece.position);
            if (northCell) {
                var southCellStandingPiece = northCell.GetStandingPiece();
                if (southCellStandingPiece) {
                    //stop
                }
                else {
                    output.push(northCell);
                    var northCellTwo = this.GetNorthCell(northCell.position);
                    if (northCellTwo) {
                        var southCellTwoStandingPiece = northCellTwo.GetStandingPiece();
                        if (southCellTwoStandingPiece) {
                        }
                        else {
                            output.push(northCellTwo);
                        }
                    }
                }
            }
            var northWestCell = this.GetNorthWestCell(piece.position);
            if (northWestCell) {
                var northWestCellStandingPiece = northWestCell.GetStandingPiece();
                if (northWestCellStandingPiece) {
                    if (northWestCellStandingPiece.team === ChessGame.Team.North) {
                        output.push(northWestCell);
                    }
                }
            }
            var northEastCell = this.GetNorthEastCell(piece.position);
            if (northEastCell) {
                var northEastCellStandingPiece = northEastCell.GetStandingPiece();
                if (northEastCellStandingPiece) {
                    if (northEastCellStandingPiece.team === ChessGame.Team.North) {
                        output.push(northEastCell);
                    }
                }
            }
        }
        console.log(output);
        return output;
    };
    ChessGameInfo.prototype.GetSouthCell = function (position) {
        if (position.y == 7)
            return null;
        return this.grid[position.x][position.y + 1];
    };
    ChessGameInfo.prototype.GetNorthCell = function (position) {
        if (position.y == 0)
            return null;
        return this.grid[position.x][position.y - 1];
    };
    ChessGameInfo.prototype.GetNorthWestCell = function (position) {
        if (position.x == 0 || position.y == 0)
            return null;
        return this.grid[position.x - 1][position.y - 1];
    };
    ChessGameInfo.prototype.GetNorthEastCell = function (position) {
        if (position.x == 7 || position.y == 0)
            return null;
        return this.grid[position.x + 1][position.y - 1];
    };
    ChessGameInfo.prototype.GetSouthWestCell = function (position) {
        if (position.x == 0 || position.y == 7) {
            return null;
        }
        else {
            return this.grid[position.x - 1][position.y + 1];
        }
    };
    ChessGameInfo.prototype.GetSouthEastCell = function (position) {
        if (position.x == 0 || position.y == 7)
            return null;
        return this.grid[position.x + 1][position.y + 1];
    };
    ChessGameInfo.prototype.GetWestCell = function (position) {
        if (position.x == 0)
            return null;
        return this.grid[position.x - 1][position.y];
    };
    ChessGameInfo.prototype.GetEastCell = function (position) {
        if (position.x == 7)
            return null;
        return this.grid[position.x + 1][position.y];
    };
    ChessGameInfo.prototype.GetCellByPosition = function (position) {
        return this.grid[position.x][position.y];
    };
    ChessGameInfo.prototype.GetTeamBySocket = function (socketId) {
        if (this.NorthTeamSocketId === socketId) {
            return ChessGame.Team.North;
        }
        else if (this.SouthTeamSocketId === socketId) {
            return ChessGame.Team.South;
        }
        else {
            return undefined;
        }
    };
    return ChessGameInfo;
}());
exports.ChessGameInfo = ChessGameInfo;
