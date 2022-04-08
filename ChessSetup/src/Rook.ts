import { Cell } from "./Cell";
import { Team ,PieceType} from "./ChessApp";
import { Piece } from "./Piece";

export class Rook extends Piece{
    FindMovementAvailableCells(cellList : Cell[]) : Cell[] | undefined {
        let output : Cell[] | undefined = [];
        let northCell : Cell | undefined = this.FindNorthCell(this.currentStandingCell!);
        let westCell : Cell | undefined = this.FindWestCell(this.currentStandingCell!);
        let eastCell : Cell | undefined = this.FindEastCell(this.currentStandingCell!);
        let southCell : Cell | undefined = this.FindSouthCell(this.currentStandingCell!);

        for(let i : number = 0; i<8 ;i++)
        {
            if(northCell && this.CanMoveToCellWithAttack(northCell))
            {
                output.push(northCell);
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
                output.push(westCell);
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
                output.push(eastCell);
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
                output.push(southCell);
                southCell = this.FindSouthCell(southCell);
                continue;
            }
            else
            {
                break;
            }
        }
        
        return output;

    }
    constructor(x:number,y:number,team:Team,cellList:Cell[],pieceList:Piece[])
    {
        super(x,y,team,cellList,pieceList);
        this.img?.classList.add(`${Rook.name}`)
        this.PieceType = PieceType.Rook;
    }
}
