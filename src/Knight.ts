import { Cell } from "./Cell";
import { Team ,PieceType} from "./ChessApp";
import { Piece } from "./Piece";

export class Knight extends Piece{
    FindMovementAvailableCells(): Cell[] | undefined{
        let teamCellList : Cell[] | undefined = [];
        let northCell : Cell | undefined = this.FindNorthCell(this.currentStandingCell);
        let westCell : Cell | undefined = this.FindWestCell(this.currentStandingCell);
        let southCell : Cell | undefined = this.FindSouthCell(this.currentStandingCell);
        let eastCell : Cell | undefined = this.FindEastCell(this.currentStandingCell);
        if(northCell)
        {
            let northNorthWestCell : Cell | undefined = this.FindNorthWestCell(northCell);
            let northNorthEastCell : Cell | undefined = this.FindNorthEastCell(northCell);
            if(northNorthWestCell && this.CanMoveToCellWithAttack(northNorthWestCell))
                    teamCellList.push(northNorthWestCell);
            if(northNorthEastCell && this.CanMoveToCellWithAttack(northNorthEastCell))
                    teamCellList.push(northNorthEastCell);
        }
        if(westCell)
        {
            let westNorthWestCell : Cell | undefined = this.FindNorthWestCell(westCell);
            let westSouthWestCell : Cell | undefined = this.FindSouthWestCell(westCell);
            if(westNorthWestCell)
            {
                if(this.CanMoveToCellWithAttack(westNorthWestCell))
                {
                    teamCellList.push(westNorthWestCell);
                }
            }
            if(westSouthWestCell)
            {
                if(this.CanMoveToCellWithAttack(westSouthWestCell))
                {
                    teamCellList.push(westSouthWestCell);
                }
            }
        }



        if(southCell)
        {
            let southSouthWestCell : Cell | undefined = this.FindSouthWestCell(southCell);
            let southSouthEastCell : Cell | undefined = this.FindSouthEastCell(southCell);
            if(southSouthWestCell)
            {
                if(this.CanMoveToCellWithAttack(southSouthWestCell))
                {
                    teamCellList.push(southSouthWestCell);
                }
            }
            if(southSouthEastCell)
            {
                if(this.CanMoveToCellWithAttack(southSouthEastCell))
                {
                    teamCellList.push(southSouthEastCell);
                }
            }
        }

        if(eastCell)
        {
            let eastNorthEastCell : Cell | undefined = this.FindNorthEastCell(eastCell);
            let eastSouthEastCell : Cell | undefined = this.FindSouthEastCell(eastCell);
            if(eastNorthEastCell)
            {
                if(this.CanMoveToCellWithAttack(eastNorthEastCell))
                {
                    teamCellList.push(eastNorthEastCell);
                }
            }
            if(eastSouthEastCell)
            {
                if(this.CanMoveToCellWithAttack(eastSouthEastCell))
                {
                    teamCellList.push(eastSouthEastCell);
                }
            }
        }

        return teamCellList;

    }
    constructor(x:number,y:number,team:Team,cellList:Cell[],pieceList:Piece[])
    {
        super(x,y,team,cellList,pieceList);
        this.img.classList.add(`${Knight.name}`)
        console.log("Knight is born");
        this.PieceType = PieceType.Knight;
    }
}
