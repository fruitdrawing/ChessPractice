import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const clientSocket = io("http://localhost:3000");
let rooms = [];

let clientNickName = "";
const nickNameSubmitButton = document.getElementById("nickname-submit-button");

nickNameSubmitButton.addEventListener('click', () => {
    let nickNameInput = document.getElementById("nick-name-input");
    clientSocket.emit('nickname-changed', nickNameInput.value);
});

const nickNameDisplayElement = document.getElementById('nickname-display');
clientSocket.on('nickname-changed', (nickName) => {
    clientNickName = nickName;
    nickNameDisplayElement.innerText = nickName;
});

const hostButton = document.getElementById("host-button");

hostButton.addEventListener('click', () => {
    console.log("host button clicked!");
    let roomTitleInput = document.getElementById("room-title-input");
    if (roomTitleInput.value.length > 3) {
        clientSocket.emit('create-room', {
            roomTitle: roomTitleInput.value,
            teamOfHost: "North",
            hostNickName: clientNickName
        });
        roomTitleInput.value = "";
    } else {
        alert('you need a Room title longer than 3 characters!')
    }

});

//Player joined
clientSocket.on('player-joined', function (data) {
    console.log('player-joined event:', data);
    //Game Start ! ! !! ! 
    //! off all the pages first ! ! ! ! !
    document.getElementById(1).style.display = 'none';
    document.getElementById(2).style.display = 'none';
    document.getElementById(3).style.display = 'none';
    createChessBoard();
    window.scrollTo(0, 0);
    clientSocket.emit('request-current-chessinfo');

});


clientSocket.on('receive-current-chessinfo', function (data) {
    //! setup chessboard pieces by received data

});


//Room List
clientSocket.on('rooms', function (data) {

    rooms = data;
    console.log('client Socket id:', clientSocket.id);
    console.log('recevied rooms!');
    const roomlist = document.getElementById("room-list");
    roomlist.innerHTML = "";
    roomlist.append(...data.filter((room) => room.socketId !== clientSocket.id).map((room, index) => {
        let button = document.createElement('button');
        button.setAttribute('class', 'room-list-button');
        button.setAttribute('id', 'room-' + index);
        button.innerText = room.roomTitle;
        return button;
    }));

    //Global
    roomlist.onclick = (ev) => {
        console.log("room button clicked! id:", ev.target.getAttribute('id'));
        // createChessBoard();
        clientSocket.emit('join-room', ev.target.innerText);
        // Join
    };

    //delete all child elements of room list div

    //map something from data recevied

    //insert data to room list div
});

clientSocket.emit('get-rooms', 'hello');

// clientSocket.on('join-room',(msg)=>{

// });

// document.addEventListener('keydown', function (event) {
//     let keycodeVal = String.fromCharCode(event.keyCode);
//     if (document.getElementById(keycodeVal).style.display == 'none') {
//         document.getElementById(keycodeVal).style.display = 'block';
//     }
//     else {
//         document.getElementById(keycodeVal).style.display = 'none';
//     }
// });
/////////////////////////////////


const multiplayChessDiv = document.getElementById("multiplayer-chessboard")

let multiplayChessCellList = [];


function GetAvailableCells(fromPiece) {

}

function Refresh() {

}

// function ClickCell() {

// }

function createChessBoard() {
    for (let j = 0; j < 8; j++) {
        for (let i = 0; i < 8; i++) {
            let cellHTMLElement = document.createElement("button");

            let xRemainder = j % 2;
            let yRemainder = i % 2;
            if (yRemainder == 0) {
                if (xRemainder == 0) {
                    cellHTMLElement.classList.add("cell-even");
                }
                else {
                    cellHTMLElement.classList.add("cell");
                }
            }
            else {
                if (xRemainder == 0) {
                    cellHTMLElement.classList.add("cell");
                }
                else {
                    cellHTMLElement.classList.add("cell-even");
                }
            }
            cellHTMLElement.id = `${i},${j}`;
            cellHTMLElement.innerText = `${i},${j}`;

            let cell = new Cell(i, j, cellHTMLElement);
            multiplayChessCellList.push(cell);
            multiplayChessDiv.append(cellHTMLElement);
            multiplayChessDiv.onclick = (ev) => {
                if (ev) {
                    console.log('ev', ev.target);
                    clientSocket.emit('clicked-cell', { socket: clientSocket, cell: ev.target.getAttribute('id'),);
                }
            }
        }
    }
}

clientSocket.on('chess-setup-board', function (grid) {

});

function SetupChessBoardByGrid(grid) {
    grid.forEach(x => {

    })
}
function SpawnPiece() {
    htmlElement = document.createElement('img');

    htmlElement.classList.add('pawn');

    cell = document.getElementById("1,2");
    cell.appendChild(htmlElement);
}
// function SpawnPieces() {
//     let pawn = new Pawn(1, 2, 3, 4);
// }
// class Piece {
//     x;
//     y;
//     id;
//     htmlElement;

//     constructor(x, y, id, htmlElement) {
//     }
// }

// class Pawn extends Piece {
//     constructor(x, y, id, htmlElement) {
//         super(x, y, id, htmlElement);
//     }
// }


class Cell {
    id;
    isOccupied;
    x;
    y;
    htmlElement;
    constructor(x, y, desiredhtmlElement) {
        this.x = x;
        this.y = y;
        this.htmlElement = desiredhtmlElement;
    }
}