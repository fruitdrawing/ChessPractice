import { Cell } from './cell';
import { Team , PieceType} from './ChessApp';

export abstract class Piece{
    x:number;
    y:number;
    img:HTMLImageElement;
    clickArea : HTMLElement;
    team: Team;
    currentStandingCell : Cell;
    PieceType : PieceType;

    readonly cellListRef : Cell[]
    readonly pieceListRef : Piece[]
    constructor(x:number,y:number,team:Team,cellList:Cell[],pieceList:Piece[]){
        this.x = x;
        this.y = y;
        this.team = team;
        this.cellListRef = cellList;
        this.pieceListRef = pieceList;
        this.SetupHTMLElement(x,y,team);
        this.Move(x,y);
    }

    SetupHTMLElement(x:number,y:number,team:Team)
    {
        let found : Cell = this.cellListRef.find(e => e.id == `${x},${y}`)!;
        this.img = document.createElement("img");
        this.img.classList.add("Piece");
        var cell = document.getElementById(`${x},${y}`)!;
        cell.append(this.img);
        this.img.classList.add(team.toString()+"Team");
    }


    Move(x:number,y:number) : void
    {

        let oldStandingCell : Cell = this.cellListRef.find(e => e.id == `${this.x},${this.y}`)!;
        let newStandingCell : Cell = this.cellListRef.find(e => e.id == `${x},${y}`)!;
        if(!this.CanMoveToCellWithAttack(newStandingCell))
        {
            console.log("Movement Failed!");
            return;
        }
        else
        {
            let newParent = document.getElementById(`${x},${y}`);
            newParent?.appendChild(this.img);
            this.x = x;
            this.y = y;
            oldStandingCell.SetOccupied(false);
            // oldStandingCell.StandingPiece = undefined;
            // newStandingCell.StandingPiece = this;
            newStandingCell.SetOccupied(true);
            this.currentStandingCell = newStandingCell;
            console.log("Move Success");
        }
    }
    
    abstract FindMovementAvailableCells(cell : Cell[]) : Cell[] | undefined;


    Kill(piece:Piece) : void
    {
        piece.Die();
    }
    
    Die() : void
    {
        // this.currentStandingCell.SetOccupied(false);
        this.img.remove();
        console.log("Dead ! !");
    }

    FindNorthCell(cell : Cell) : Cell | undefined
    {
        let foundCell : Cell | undefined = this.cellListRef.find(e => (e.x == cell.x) && (e.y == cell.y - 1));
        return foundCell;
    }

    FindWestCell(cell : Cell) : Cell | undefined
    {
        let foundCell : Cell | undefined = this.cellListRef.find(e => (e.x == cell.x-1) && (e.y == cell.y));
        return foundCell;
    }

    FindEastCell(cell : Cell) : Cell | undefined
    {
        let foundCell : Cell | undefined = this.cellListRef.find(e => (e.x == cell.x+1) && (e.y == cell.y));
        return foundCell;
    }

    FindSouthCell(cell : Cell) : Cell | undefined
    {
        let foundCell : Cell | undefined = this.cellListRef.find(e => (e.x == cell.x) && (e.y == cell.y+1));
        return foundCell;
    }

    FindNorthWestCell(cell : Cell) : Cell | undefined
    {
        let foundCell : Cell | undefined = this.cellListRef.find(e => (e.x == cell.x-1) && (e.y == cell.y-1));
        return foundCell;
    }
    
    FindNorthEastCell(cell : Cell) : Cell | undefined
    {
        let foundCell : Cell | undefined = this.cellListRef.find(e => (e.x == cell.x+1) && (e.y == cell.y-1));
        return foundCell;
    }

    FindSouthWestCell(cell : Cell) : Cell | undefined
    {
        let foundCell : Cell | undefined = this.cellListRef.find(e => (e.x == cell.x-1) && (e.y == cell.y+1));
        return foundCell;
    } 

    FindSouthEastCell(cell : Cell) : Cell | undefined
    {
        let foundCell : Cell | undefined = this.cellListRef.find(e => (e.x == cell.x+1) && (e.y == cell.y+1));
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


    CheckSomeoneIsThere(toCell:Cell |undefined) : boolean
    {
        if(!toCell) return false;
        //
        if(toCell.CheckOccupied() == true || toCell == undefined)
        {
            return false;
        }
        return true;
    }
    
    CanMoveToCellWithAttack(cell : Cell | undefined) : boolean
    {
        if(!cell) return false;

        if(cell.CheckOccupied())
        {
            let stnadingPiece : Piece = this.pieceListRef.find(p => p.x == cell.x && p.y == cell.y)!;
            if(stnadingPiece.team == this.team)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            return true;
        }
    }
    HasOpponentInCell(cell:Cell | undefined) : boolean
    {
        if(!cell) return false;
        if(cell.CheckOccupied())
        {
            let standingPiece : Piece = this.pieceListRef.find(p => p.x == cell.x && p.y == cell.y)!;
            if(standingPiece.team != this.team)
            return true;
        }
        return false;

    }
}
