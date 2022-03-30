import { GameManager } from "./GameManager"

export class Cell{
    readonly x : number;
    readonly y : number;
    readonly id : string;
    private IsOccupied :boolean = false;
    // StandingPiece : Piece;
    readonly HTMLElement : HTMLButtonElement;
    onClickEvent : Event
    gameManageRef : GameManager
    constructor(x: number, y: number,button : HTMLButtonElement,gameManager : GameManager){
        this.x = x;
        this.y = y;
        this.id = `${x},${y}`;
        this.HTMLElement = button;   
        this.HTMLElement.classList.add('cell');
        this.gameManageRef = gameManager;
        let clickFn = this.OnClick.bind(this);
        this.HTMLElement.addEventListener('click', clickFn);
    }
   
    OnClick(event : MouseEvent)
    {
        console.log("On Clicked");
        this.gameManageRef.ReceiveCellButtonEvent(this);
    }
    TurnOnMovementAvailableState()
    {
        if(this.HTMLElement.classList.contains('movementAvailableCell'))
        {
            return;
        }
        else
        {
            this.HTMLElement.classList.add('movementAvailableCell');
        }
    }

    TurnOffMovementAvailableState()
    {
        if(this.HTMLElement.classList.contains('movementAvailableCell'))
        {
            this.HTMLElement.classList.remove('movementAvailableCell');
        }
        else
        {
            return;
        }
    }
    
    SetOccupied(bool : boolean)
    {
        this.IsOccupied = bool;
    }
    CheckOccupied() : boolean
    {
        return this.IsOccupied;
    }

    IsAvailableMovementCell() : boolean
    {
        return this.HTMLElement.classList.contains('movementAvailableCell');
    }


}

