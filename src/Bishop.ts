import { Cell } from "./Cell";
import { Team ,PieceType} from "./ChessApp";
import { Piece } from "./Piece";

export class Bishop extends Piece{
    FindMovementAvailableCells(): Cell[] {
        let teamCellList : Cell[] | undefined = [];
        
        let northWestCell : Cell | undefined = this.FindNorthWestCell(this.currentStandingCell);
        let northEastCell : Cell | undefined = this.FindNorthEastCell(this.currentStandingCell);
        let southWestCell : Cell | undefined = this.FindSouthWestCell(this.currentStandingCell);
        let southEastCell : Cell | undefined = this.FindSouthEastCell(this.currentStandingCell);
      
        for(let i : number = 0; i<8 ;i++)
        {
            if(northWestCell && this.CanMoveToCellWithAttack(northWestCell))
            {
                teamCellList.push(northWestCell);
                northWestCell = this.FindNorthWestCell(northWestCell);
                continue;
            }
            else
            {
                break;
            }
        }
        for(let i : number = 0; i<8 ;i++)
        {
            if(northEastCell && this.CanMoveToCellWithAttack(northEastCell))
            {
                teamCellList.push(northEastCell);
                northEastCell = this.FindNorthEastCell(northEastCell);
                continue;
            }
            else
            {
                break;
            }
        }
        for(let i : number = 0; i<8 ;i++)
        {
            if(southWestCell && this.CanMoveToCellWithAttack(southWestCell))
            {
                teamCellList.push(southWestCell);
                southWestCell = this.FindSouthWestCell(southWestCell);
                continue;
            }
            else
            {
                break;
            }
        }
        for(let i : number = 0; i<8 ;i++)
        {
            if(southEastCell && this.CanMoveToCellWithAttack(southEastCell))
            {
                teamCellList.push(southEastCell);
                southEastCell = this.FindSouthEastCell(southEastCell);
                continue;
            }
            else
            {
                break;
            }
        }
        return teamCellList;
    }
    constructor(x:number,y:number,team:Team,cellList:Cell[],pieceList:Piece[])
    {
        super(x,y,team,cellList,pieceList);
        this.img.classList.add(`${Bishop.name}`)
        this.PieceType = PieceType.Bishop;
    }
}
