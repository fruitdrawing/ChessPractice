import { Team } from "./ChessEnum";
import * as ChessGame from './index';
import type { Board } from "./Board";

export class ChessGameInfo {
    CurrentTurn: ChessGame.Team = ChessGame.Team.North;
    NorthTeamSocketId: string = "";
    SouthTeamSocketId: string = "";
    pieceList: ChessGame.Piece[] = [];
    cellList: ChessGame.Cell[] = [];
    grid: Board = this.CreateServerGrid();
    CurrentAvailableCells: ChessGame.Cell[] | undefined = undefined;
    CurrentSelectedPiece: ChessGame.Piece | undefined;
    // 2d array 
    // [[rook,knight...],[pawn,pawn,pawn...],[undeifined,undo...],[],[],[],[pawn,pawn],[rook,knight]] 
    CurrentGameState: ChessGame.GameState = ChessGame.GameState.WaitingForPieceSelection;
    CommandList: string[] = [];
    constructor(hostSocketId: string, joinedUserSocketId: string) {
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
    SetCurrentSelectedPiece(piece: ChessGame.Piece | undefined) {
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
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(0, 0), ChessGame.Team.North, ChessGame.PieceType.Pawn);
        this.SetupGridByPositionTeamPiece(new ChessGame.Vector2(1, 6), ChessGame.Team.South, ChessGame.PieceType.Pawn);

    }
    SetupGridByPositionTeamPiece(position: ChessGame.Vector2, team: ChessGame.Team, pieceType: ChessGame.PieceType) {
        this.grid[position.x][position.y]!.SetStandingPiece(new ChessGame.Piece(team, pieceType, position));

    }
    // SetStandingPiece(board: Board, team: Team, pieceType: ChessGame.PieceType, position: ChessGame.Vector2) {
    //     board[position.x][position.y] = new ChessGame.Cell(team, pieceType, position);
    // }

    //@ts-ignore
    Move(piece: ChessGame.Piece, To: ChessGame.Cell, From: ChessGame.Cell) {
        //Is it available?
        console.log('from', From);
        console.log('to', To);
        console.log('piece', piece);

        this.grid[From.position.x][From.position.y]?.SetStandingPiece(undefined);
        piece.position = To.position;
        this.grid[To.position.x][To.position.y]?.SetStandingPiece(piece);
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
    GetAvailableCells(team: ChessGame.Team, piece: ChessGame.Piece | undefined): ChessGame.Cell[] | undefined {
        console.log('GetAvailableCells called');
        let output;
        if (piece) {
            switch (piece.pieceType) {
                case ChessGame.PieceType.Pawn:
                    output = this.GetAvailableCellsByPawn(team, piece)

                    break;
                case ChessGame.PieceType.Bishop:
                    break;

                case ChessGame.PieceType.King:
                    break;


            }
        }
        return output;
    }

    GetAvailableCellsByPawn(team: ChessGame.Team, piece: ChessGame.Piece) {
        let output: ChessGame.Cell[] = [];
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
                            output.push(southCellTwo)
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
                            output.push(northCellTwo)
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

    GetSouthCell(position: ChessGame.Vector2): ChessGame.Cell | null {
        if (position.y == 7) return null;
        return this.grid[position.x][position.y + 1];
    }

    GetNorthCell(position: ChessGame.Vector2): ChessGame.Cell | null {
        if (position.y == 0) return null;
        return this.grid[position.x][position.y - 1];
    }
    GetNorthWestCell(position: ChessGame.Vector2): ChessGame.Cell | null {
        if (position.x == 0 || position.y == 0) return null;
        return this.grid[position.x - 1][position.y - 1];
    }

    GetNorthEastCell(position: ChessGame.Vector2): ChessGame.Cell | null {
        if (position.x == 7 || position.y == 0) return null;
        return this.grid[position.x + 1][position.y - 1];
    }

    GetSouthWestCell(position: ChessGame.Vector2): ChessGame.Cell | null {
        if (position.x == 0 || position.y == 7) {
            return null;
        }
        else {
            return this.grid[position.x - 1][position.y + 1];

        }
    }
    GetSouthEastCell(position: ChessGame.Vector2): ChessGame.Cell | null {
        if (position.x == 0 || position.y == 7) return null;
        return this.grid[position.x + 1][position.y + 1];
    }
    GetWestCell(position: ChessGame.Vector2): ChessGame.Cell | null {
        if (position.x == 0) return null;

        return this.grid[position.x - 1][position.y];
    }
    GetEastCell(position: ChessGame.Vector2): ChessGame.Cell | null {
        if (position.x == 7) return null;

        return this.grid[position.x + 1][position.y];
    }

    GetCellByPosition(position: ChessGame.Vector2): ChessGame.Cell | null {

        return this.grid[position.x][position.y];
    }
    GetTeamBySocket(socketId: string): ChessGame.Team | undefined {
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