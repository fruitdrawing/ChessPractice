import { Cell } from "./Cell";
import { Team ,PieceType} from "./ChessApp";
import { Piece } from "./Piece";

export class Pawn extends Piece{
    constructor(x:number,y:number,team:Team,cellList:Cell[],pieceList:Piece[]){
        super(x,y,team,cellList,pieceList);
        this.img.classList.add(`${Pawn.name}`)
        this.PieceType = PieceType.Pawn;
    }

    FindMovementAvailableCells(): Cell[] | undefined {
        let tempCellList : Cell[] | undefined = [];

        if(this.team == Team.North)
        {
            // todo : 확 줄여야함.
            let forwardOne : Cell | undefined = this.FindSouthCell(this.currentStandingCell);
            if(this.CheckSomeoneIsThere(forwardOne))
            {
                if(!this.HasOpponentInCell(forwardOne))
                {
                    if(forwardOne != undefined)
                    {
                        tempCellList.push(forwardOne);
                        let forwardTwo : Cell | undefined  = this.FindSouthCell(forwardOne)!;
                        if(this.CanMoveToCellWithAttack(forwardTwo))
                        {
                            if(!this.HasOpponentInCell(forwardTwo))
                            {
                                tempCellList.push(forwardTwo);
                            }
                        }
                    }
                }
            }
            let forwardRight : Cell | undefined = this.FindSouthWestCell(this.currentStandingCell);


            if(this.HasOpponentInCell(forwardRight))
            {
                if(forwardRight != undefined)
                {
                    tempCellList.push(forwardRight);
                }
            }
            let forwardLeft : Cell | undefined = this.FindSouthEastCell(this.currentStandingCell);

            if(this.HasOpponentInCell(forwardLeft))
            {
                if(forwardLeft != undefined)
                {
                    tempCellList.push(forwardLeft);
                }
            }
        }
        else
        {
            let forwardOne : Cell | undefined = this.FindNorthCell(this.currentStandingCell)!;
            if(this.CanMoveToCellWithAttack(forwardOne))
            {
                if(!this.HasOpponentInCell(forwardOne))
                {
                    tempCellList.push(forwardOne);
                    let forwardTwo = this.FindNorthCell(forwardOne)!;
                    if(this.CanMoveToCellWithAttack(forwardTwo))
                    {
                        if(!this.HasOpponentInCell(forwardTwo))
                        {
                            tempCellList.push(forwardTwo);
                        }

                    }
                }
            }
            let forwardRight : Cell | undefined = this.FindNorthEastCell(this.currentStandingCell);

            if(this.HasOpponentInCell(forwardRight))
            {
                if(forwardRight != undefined)
                {
                    tempCellList.push(forwardRight);
                }
            }
            let forwardLeft : Cell | undefined = this.FindNorthWestCell(this.currentStandingCell);

            if(this.HasOpponentInCell(forwardLeft))
            {
                if(forwardLeft != undefined)
                {
                    tempCellList.push(forwardLeft);
                }
            }

        }
        return tempCellList;

        }
       

    }
    

