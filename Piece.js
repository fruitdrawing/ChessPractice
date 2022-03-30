export class Piece {
    constructor(x, y, team, cellList, pieceList) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.cellListRef = cellList;
        this.pieceListRef = pieceList;
        this.SetupHTMLElement(x, y, team);
        this.Move(x, y);
    }
    SetupHTMLElement(x, y, team) {
        let found = this.cellListRef.find(e => e.id == `${x},${y}`);
        this.img = document.createElement("img");
        this.img.classList.add("Piece");
        var cell = document.getElementById(`${x},${y}`);
        cell.append(this.img);
        this.img.classList.add(team.toString() + "Team");
    }
    Move(x, y) {
        let oldStandingCell = this.cellListRef.find(e => e.id == `${this.x},${this.y}`);
        let newStandingCell = this.cellListRef.find(e => e.id == `${x},${y}`);
        if (!this.CanMoveToCellWithAttack(newStandingCell)) {
            console.log("Movement Failed!");
            return;
        }
        else {
            let newParent = document.getElementById(`${x},${y}`);
            newParent === null || newParent === void 0 ? void 0 : newParent.appendChild(this.img);
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
    Kill(piece) {
        piece.Die();
    }
    Die() {
        // this.currentStandingCell.SetOccupied(false);
        this.img.remove();
        console.log("Dead ! !");
    }
    FindNorthCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x) && (e.y == cell.y - 1));
        return foundCell;
    }
    FindWestCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x - 1) && (e.y == cell.y));
        return foundCell;
    }
    FindEastCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x + 1) && (e.y == cell.y));
        return foundCell;
    }
    FindSouthCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x) && (e.y == cell.y + 1));
        return foundCell;
    }
    FindNorthWestCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x - 1) && (e.y == cell.y - 1));
        return foundCell;
    }
    FindNorthEastCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x + 1) && (e.y == cell.y - 1));
        return foundCell;
    }
    FindSouthWestCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x - 1) && (e.y == cell.y + 1));
        return foundCell;
    }
    FindSouthEastCell(cell) {
        let foundCell = this.cellListRef.find(e => (e.x == cell.x + 1) && (e.y == cell.y + 1));
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
    CheckSomeoneIsThere(toCell) {
        if (!toCell)
            return false;
        //
        if (toCell.CheckOccupied() == true || toCell == undefined) {
            return false;
        }
        return true;
    }
    CanMoveToCellWithAttack(cell) {
        if (!cell)
            return false;
        if (cell.CheckOccupied()) {
            let stnadingPiece = this.pieceListRef.find(p => p.x == cell.x && p.y == cell.y);
            if (stnadingPiece.team == this.team) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    HasOpponentInCell(cell) {
        if (!cell)
            return false;
        if (cell.CheckOccupied()) {
            let standingPiece = this.pieceListRef.find(p => p.x == cell.x && p.y == cell.y);
            if (standingPiece.team != this.team)
                return true;
        }
        return false;
    }
}
