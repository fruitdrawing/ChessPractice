import { Cell } from "./cell";
import { Team ,PieceType} from "./ChessApp";
import { Piece } from "./Piece";



export class Queen extends Piece{
    FindMovementAvailableCells(cellList : Cell[]) : Cell[] | undefined {
        let teamCellList : Cell[] | undefined = [];
        let northCell : Cell | undefined = this.FindNorthCell(this.currentStandingCell);
        let westCell : Cell | undefined = this.FindWestCell(this.currentStandingCell);
        let eastCell : Cell | undefined = this.FindEastCell(this.currentStandingCell);
        let southCell : Cell | undefined = this.FindSouthCell(this.currentStandingCell);

        for(let i : number = 0; i<8 ;i++)
        {
            if(northCell && this.CanMoveToCellWithAttack(northCell))
            {
                teamCellList.push(northCell);
                northCell = this.FindNorthCell(northCell);
                continue;
            }
            else
            {
                break;
            }
        }
        for(let i : number = 0; i<8 ;i++)
        {
            if(westCell && this.CanMoveToCellWithAttack(westCell))
            {
                teamCellList.push(westCell);
                westCell = this.FindWestCell(westCell);
                continue;
            }
            else
            {
                break;
            }
        }
        for(let i : number = 0; i<8 ;i++)
        {
            if(eastCell&& this.CanMoveToCellWithAttack(eastCell))
            {
                teamCellList.push(eastCell);
                eastCell = this.FindEastCell(eastCell);
                continue;
            }
            else
            {
                break;
            }
        }
        for(let i : number = 0; i<8 ;i++)
        {
            if(southCell&& this.CanMoveToCellWithAttack(southCell))
            {
                teamCellList.push(southCell);
                southCell = this.FindSouthCell(southCell);
                continue;
            }
            else
            {
                break;
            }
        }
        
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
        this.img.classList.add(`${Queen
            .name}`)
        this.PieceType = PieceType.Queen;
    }
}

export class King extends Piece{   
    FindMovementAvailableCells(): Cell[] {
        let teamCellList : Cell[] | undefined = [];
        let northCell : Cell | undefined = this.FindNorthCell(this.currentStandingCell);
        let northWestCell : Cell | undefined = this.FindNorthWestCell(this.currentStandingCell);
        let northEastCell : Cell | undefined = this.FindNorthEastCell(this.currentStandingCell);
        let eastCell : Cell | undefined = this.FindEastCell(this.currentStandingCell);
        let westCell : Cell | undefined = this.FindWestCell(this.currentStandingCell);
        let southCell : Cell | undefined = this.FindSouthCell(this.currentStandingCell);
        let southWestCell : Cell | undefined = this.FindSouthWestCell(this.currentStandingCell);
        let southEastCell : Cell | undefined = this.FindSouthEastCell(this.currentStandingCell);

        if(northCell)  
        {
            if(this.CanMoveToCellWithAttack(northCell)) teamCellList.push(northCell);
        } 
        if(northWestCell && this.CanMoveToCellWithAttack(northWestCell)) teamCellList.push(northWestCell);
        if(northEastCell&& this.CanMoveToCellWithAttack(northEastCell)) teamCellList.push(northEastCell);
        if(eastCell&& this.CanMoveToCellWithAttack(eastCell)) teamCellList.push(eastCell);
        if(westCell&& this.CanMoveToCellWithAttack(westCell)) teamCellList.push(westCell);
        if(southCell&& this.CanMoveToCellWithAttack(southCell)) teamCellList.push(southCell);
        if(southWestCell&& this.CanMoveToCellWithAttack(southWestCell)) teamCellList.push(southWestCell);
        if(southEastCell&& this.CanMoveToCellWithAttack(southEastCell)) teamCellList.push(southEastCell);

        return teamCellList;

    }
    constructor(x:number,y:number,team:Team,cellList:Cell[],pieceList:Piece[]){
        super(x,y,team,cellList,pieceList);
        this.img.classList.add(`${King.name}`)
        this.PieceType = PieceType.King;
    }
}
