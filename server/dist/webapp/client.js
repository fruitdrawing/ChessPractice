"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const ChessGame = __importStar(require("../server/Chess/index"));
const clientSocket = (0, socket_io_client_1.io)("http://localhost:3000");
let rooms = [];
let clientNickName = "";
const nickNameSubmitButton = document.getElementById("nickname-submit-button");
nickNameSubmitButton.addEventListener('click', () => {
    let nickNameInput = document.getElementById("nick-name-input");
    clientSocket.emit('nickname-changed', nickNameInput.innerText);
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
    if (roomTitleInput.innerText.length > 3) {
        clientSocket.emit('create-room', {
            roomTitle: roomTitleInput.innerText,
            teamOfHost: "North",
            hostNickName: clientNickName
        });
        roomTitleInput.innerText = "";
    }
    else {
        alert('you need a Room title longer than 3 characters!');
    }
});
//Player joined
clientSocket.on('player-joined', function (data) {
    console.log('player-joined event:', data);
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
        button.innerText = room.roomTitle + ' by ' + room.hostNickName;
        return button;
    }));
    //Global
    roomlist.onclick = (ev) => {
        // console.log("room button clicked! id:", ev.target.getAttribute('id'));
        // createChessBoard();
        let htmlElement = ev.target;
        clientSocket.emit('join-room', htmlElement.innerText);
        // Join
    };
    //delete all child elements of room list div
    //map something from data recevied
    //insert data to room list div
});
clientSocket.emit('get-rooms', 'hello');
const multiplayChessDiv = document.getElementById("multiplayer-chessboard");
let multiplayChessCellList = [];
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
            let cell = new ChessGame.Cell(i, j);
            multiplayChessCellList.push(cell);
            multiplayChessDiv.append(cellHTMLElement);
            multiplayChessDiv.onclick = (ev) => {
                if (ev) {
                    console.log('ev', ev.target);
                    let evtarget = ev.target;
                    clientSocket.emit('clicked-cell', { socket: clientSocket, cell: evtarget.getAttribute('id') });
                }
            };
        }
    }
}
