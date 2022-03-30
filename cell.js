export class Cell {
    constructor(x, y, button, gameManager) {
        this.IsOccupied = false;
        this.x = x;
        this.y = y;
        this.id = `${x},${y}`;
        this.HTMLElement = button;
        this.HTMLElement.classList.add('cell');
        this.gameManageRef = gameManager;
        let clickFn = this.OnClick.bind(this);
        this.HTMLElement.addEventListener('click', clickFn);
    }
    OnClick(event) {
        console.log("On Clicked");
        this.gameManageRef.ReceiveCellButtonEvent(this);
    }
    TurnOnMovementAvailableState() {
        if (this.HTMLElement.classList.contains('movementAvailableCell')) {
            return;
        }
        else {
            this.HTMLElement.classList.add('movementAvailableCell');
        }
    }
    TurnOffMovementAvailableState() {
        if (this.HTMLElement.classList.contains('movementAvailableCell')) {
            this.HTMLElement.classList.remove('movementAvailableCell');
        }
        else {
            return;
        }
    }
    SetOccupied(bool) {
        this.IsOccupied = bool;
    }
    CheckOccupied() {
        return this.IsOccupied;
    }
    IsAvailableMovementCell() {
        return this.HTMLElement.classList.contains('movementAvailableCell');
    }
}
