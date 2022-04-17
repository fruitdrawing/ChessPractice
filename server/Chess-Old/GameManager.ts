import { Cell } from './Cell';
import { Piece } from './Piece';

import { GameState_PlayingState, GameState, Team } from './ChessApp.js';
import { Pawn } from './Pawn.js';
import { Rook } from './Rook.js';
import { Knight } from './Knight.js';
import { Bishop } from './Bishop.js';
import { King,Queen } from './King.js';
import { Command, MoveCommand } from './Command';

export class GameManager
{
    mainDiv: HTMLElement;
    startButton : HTMLElement;
    resetButton : HTMLElement;
    cellList: Cell[] = [];
    currentAvailableMovementCells: Cell[] | undefined = [];
    offset?: number;
    margin: number = 20;
    pieceList : Piece[] = [];
    board? : number[][];
    isGamePlaying? : boolean;
    _currentGameState? : GameState;
    currentTurnState : GameState_PlayingState;
    // mapInfo : MapInfo;
    // commandList : Command[]
    currentSelectedPiece : Piece | undefined;
    currentPlayingTeam? : Team;
    grid : HTMLElement;
    turnStateHtmlText : HTMLElement | null;
    winLostStateHtmlText : HTMLElement| null;
    _commandList : Command[] = [];
    
    constructor()
    {
        this.mainDiv = document.getElementById('grid')!;
        this.turnStateHtmlText = document.getElementById('TurnStatus');
        this.winLostStateHtmlText = document.getElementById('WinText')!;
        this.startButton = document.getElementById('StartButton')!;
        // this.resetButton = document.getElementById('ResetButton')!;
        this.grid = document.getElementById('grid')!;
        this.CurrentGameState = GameState.Ready;
        this.currentTurnState = GameState_PlayingState.WaitingForPieceSelection;
        this.startButton.addEventListener('click',() => this.StartGame());
        // this.resetButton.addEventListener('click',() => this.ResetButton());
        // console.log(this.commandList);

    }


    get getCurrentGameState()
    {
        return this._currentGameState;
    }

    set CurrentGameState(value: GameState)
    {
        switch(value)
        {
            case GameState.Ready :

                break;
            case GameState.StaringGame:
                this.startButton.setAttribute("stlye","pointer-events: none");
                this.startButton.setAttribute("stlye","opacity: 0.2");   
                break;

            case GameState.NorthTeamTurn:
                this.currentPlayingTeam = Team.North;
                if(this.turnStateHtmlText)
                {
                    this.turnStateHtmlText.innerHTML = Team.North;
                }
                this.turnStateHtmlText?.setAttribute("style","color:aqua;");
                break;
            case GameState.SouthTeamTurn:
                this.currentPlayingTeam = Team.South;
                if(this.turnStateHtmlText)
                {
                    this.turnStateHtmlText.innerHTML = Team.South;

                }
                this.turnStateHtmlText?.setAttribute("style","color:orange;");
                break;
            case GameState.End:
                this.startButton.setAttribute("stlye","pointer-events: auto");
                this.startButton.setAttribute("stlye","opacity: 1");
            
                break;

        }

        this._currentGameState = value;

    }


    StartGame()
    {
        this.CurrentGameState = GameState.StaringGame;
        this.startButton.classList.remove("movementAvailableCell");
        //Random Start Team;
        if(Math.floor(Math.random()) == 0)
        {
            this.CurrentGameState = GameState.NorthTeamTurn;
        }
        else
        {
            this.CurrentGameState = GameState.SouthTeamTurn;
        }
    }

    EndGame()
    {
        //Animation
        this.CurrentGameState = GameState.End;
    }


    GameStateLogic()
    {
        
    }


    DoTurnLogic(cell:Cell)
    {
        switch(this.currentTurnState)
        {
            case GameState_PlayingState.WaitingForPieceSelection:

                if(!cell.CheckOccupied())
                {
                    console.log("Empty Cell");
                    return;
                } 
                else
                {
                    let piece: Piece = this.GetPieceFromCell(cell)!;
                    // this.pieceList.find(p => cell.x == p.x && cell.y == p.y)!;
                    
                    if(piece.team == this.currentPlayingTeam)
                    {
                        this.currentAvailableMovementCells = piece.FindMovementAvailableCells(this.cellList);
                        if(this.currentAvailableMovementCells != undefined 
                            && this.currentAvailableMovementCells.length > 0)
                        {
                            this.currentAvailableMovementCells.forEach(c => 
                            {
                                c.TurnOnMovementAvailableState();
                            });

                            this.currentSelectedPiece = piece;
                            this.currentTurnState = GameState_PlayingState.WaitingForMovement;
                        }
                        else
                        {
                            console.log("This piece can't move...");
                        }
                    }
                }
                break;


            case GameState_PlayingState.WaitingForMovement:

                if(cell.IsAvailableMovementCell())
                {
                    let targetPiece : Piece | undefined = this.GetPieceFromCell(cell)!;
                    
                    if(targetPiece && targetPiece.team != this.currentSelectedPiece!.team)
                    {
                        // KILL
                        targetPiece.Die();
                        targetPiece = undefined;
                    }
                    

                    this._commandList.push(this.currentSelectedPiece!.Move(cell.x,cell.y)!);

                    this.ResetAllCellMovementAvailableState();
                    this.currentTurnState = GameState_PlayingState.TurnFinishing;


                    if(this.currentPlayingTeam == Team.South)
                    {
                        this.CurrentGameState = GameState.NorthTeamTurn;
                    }
                    else
                    {
                        this.CurrentGameState = GameState.SouthTeamTurn;
                    }


                    this.currentTurnState = GameState_PlayingState.WaitingForPieceSelection;
                    return;
                    
                }
                else
                {
                    console.log("Select available cell!");
                }
                break;
        }

        
        // document.addEventListener('click', () => {})
        
        if(this.CheckWinState() != undefined)
        {
            console.log("Check Win State");
            this.SetWin(this.CheckWinState()!);
        }
    }

    SpawnCells():void 
    {
        for(let j :number = 0 ; j < 8; j++)
        {
            for(let i :number= 0; i < 8 ; i++)
            {
                let cellHTMLElement : HTMLButtonElement = document.createElement("button");
               
                let xRemainder : number = j % 2;
                let yRemainder : number = i % 2;
                if(yRemainder == 0)
                {
                    if(xRemainder == 0)
                    {
                        cellHTMLElement.classList.add("cell-even");
                    }
                    else
                    {
                        cellHTMLElement.classList.add("cell");
                    }
                }
                else
                {
                    if(xRemainder == 0)
                    {
                        cellHTMLElement.classList.add("cell");
                    }
                    else
                    {
                        cellHTMLElement.classList.add("cell-even");
                    }
                }
                cellHTMLElement.id = `${i},${j}`;
                cellHTMLElement.innerText = `${i},${j}`;

                let cell :Cell = new Cell(i,j,cellHTMLElement,this);
                this.cellList.push(cell);

                this.mainDiv.append(cellHTMLElement);
            }
        }
    }


    SpawnPieces(): void
    {
        this.pieceList.push(new Knight(1,0,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(0,1,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(1,1,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(2,1,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(3,1,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(4,1,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(5,1,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(6,1,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(7,1,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Queen(3,0,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new King(4,0,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Bishop(2,0,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Bishop(5,0,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Knight(6,0,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Rook(0,0,Team.North,this.cellList,this.pieceList));
        this.pieceList.push(new Rook(7,0,Team.North,this.cellList,this.pieceList));





        this.pieceList.push(new Pawn(0,6,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(1,6,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(2,6,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(3,6,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(4,6,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(5,6,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(6,6,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Pawn(7,6,Team.South,this.cellList,this.pieceList));

        this.pieceList.push(new Knight(6,7,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Rook(0,7,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Rook(7,7,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new King(3,7,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Bishop(2,7,Team.South,this.cellList,this.pieceList));
        this.pieceList.push(new Bishop(5,7,Team.South,this.cellList,this.pieceList));

        this.pieceList.push(new Queen(4,7,Team.South,this.cellList,this.pieceList));

        this.pieceList.push(new Knight(1,7,Team.South,this.cellList,this.pieceList));



    }

    ReceiveCellButtonEvent(cell:Cell)
    {
        this.DoTurnLogic(cell);
    }

    GetPieceFromCell(cell:Cell) : Piece | undefined
    {
        return this.pieceList.find(p => p.x == cell.x && p.y == cell.y);
    }


    private GameOver(): void
    {

    }
        
    private ResetAllCellMovementAvailableState()
    {
        console.log("resetting");
        this.cellList.forEach(c =>
            {
                if(c.HTMLElement.classList.contains("movementAvailableCell"))
                {
                    c.HTMLElement.classList.remove("movementAvailableCell");
                }
            })
    }

    private CheckWinState() : Team | undefined
    {
        if(this.pieceList.filter(p => p.team == Team.North).length == 0)
        {
            return Team.South;
        }
        if(this.pieceList.filter(p => p.team == Team.South).length == 0)
        {
            return Team.North;
        }
        return undefined;
    }

    private SetWin(team:Team)
    {
        document.getElementById("WinText")!.innerHTML = team.toString();
        this.EndGame();
    }

    private ResetButton()
    {
        this.DestroyAllPieces();
        this.DestroyAllCells();
        this.CurrentGameState = GameState.Ready;
        this.currentTurnState = GameState_PlayingState.WaitingForPieceSelection;
        this.currentSelectedPiece = undefined;
        this.SpawnCells();
        this.SpawnPieces();
    }

    DestroyAllPieces()
    {
        this.pieceList.forEach((piece : Piece) => 
        {
            if(piece.img != null)
            {
                let node = piece.img.parentNode;
                node?.removeChild(piece.img);
            }
        });
        this.pieceList = [];
    }

    DestroyAllCells()
    {
        this.cellList.forEach((cell : Cell)=> {
            if(cell.HTMLElement != null)
            {
                 let node = cell.HTMLElement.parentNode!;
                 node.removeChild(cell.HTMLElement);
            }
        });
        this.cellList = [];
    }

    GetOppositeTeam(team:Team) : Team
    {
        if(team == Team.North)
        {
            return Team.South;
        }
        else
        {
            return Team.North;
        }
    }
}

