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
exports.ClientApp = void 0;
const ChessGame = __importStar(require("../../server/Chess"));
const DebugManager_1 = require("./DebugManager");
// import { SocketIOClient } from "./SocketIOClient";
const socket_io_client_1 = require("socket.io-client");
const ServerEnum_1 = require("../../server/ServerEnum");
class ClientApp {
    constructor() {
        this.debugManager = new DebugManager_1.DebugManager();
        // socketIOClient : SocketIOClient = new SocketIOClient();
        this.clientNickName = "";
        //"http://localhost:3001"
        this.clientSocket = (0, socket_io_client_1.io)();
        this.hostButton = document.getElementById("host-button");
        this.multiplayChessCellList = [];
        this.currentClientBoard = this.createGrid();
        this.multiplayChessDiv = document.getElementById("multiplayer-chessboard");
        this.nickNameSubmitButton = document.getElementById("nickname-submit-button");
        this.nickNameDisplayElement = document.getElementById('nickname-display');
        this.roomlist = document.getElementById("room-list");
        this.currentTurnDiv = document.getElementById("current-turn-div");
        this.titleScreen = document.getElementById("mainScreen");
        this.joinScreen = document.getElementById("joinScreen");
        this.singlePlayScreen = document.getElementById("singlePlayScreen");
        this.multiplayerScreen = document.getElementById("multiplayerScreen");
        console.log('init client');
        this.HTMLSetup();
    }
    HTMLSetup() {
        this.nickNameSubmitButton.addEventListener('click', () => {
            let nickNameInput = document.getElementById("nick-name-input");
            this.clientSocket.emit(ServerEnum_1.SocketIOEventEnum.nickNameChangedFromClient.toString(), nickNameInput.value);
        });
        this.clientSocket.on(ServerEnum_1.SocketIOEventEnum.nickNameChangedFromClient.toString(), (nickName) => {
            this.clientNickName = nickName;
            this.nickNameDisplayElement.innerText = nickName;
        });
        this.hostButton.addEventListener('click', () => {
            // console.log("host button clicked!");
            let roomTitleInput = document.getElementById("room-title-input");
            // console.log('innerHTML', roomTitleInput.innerHTML);
            if (roomTitleInput.value.length > 3) {
                this.clientSocket.emit(ServerEnum_1.SocketIOEventEnum.createRoomFromClient, {
                    roomTitle: roomTitleInput.value,
                    teamOfHost: "North",
                    hostNickName: this.clientNickName
                });
                roomTitleInput.value = "";
            }
            else {
                alert('you need a Room title longer than 3 characters!');
            }
        });
        // * Player joined a room
        this.clientSocket.on(ServerEnum_1.SocketIOEventEnum.playerJoined.toString(), (data) => {
            console.log('player-joined event:', data);
            this.clientSocket.emit('chess-setup-board');
        });
        //Room List
        this.clientSocket.on('rooms', (data) => {
            // rooms = data;
            console.log('client Socket id:', this.clientSocket.id);
            console.log('recevied rooms!!!!!!!!');
            console.log('data:', data);
            this.roomlist.innerText = "";
            this.roomlist.append(...data.filter((room) => room.socketId !== this.clientSocket.id).map((room, index) => {
                let button = document.createElement('button');
                button.setAttribute('class', 'room-list-button');
                button.setAttribute('id', 'room-' + index);
                button.innerText = room.roomTitle;
                return button;
            }));
            //Global
            this.roomlist.onclick = (ev) => {
                // console.log("room button clicked! id:", ev.target.getAttribute('id'));
                // createChessBoard();
                let htmlElement = ev.target;
                console.log('roomlist', ev);
                console.log('htmlElement', htmlElement);
                console.log('htmlElement.innerText', htmlElement.innerText);
                this.clientSocket.emit(ServerEnum_1.SocketIOEventEnum.joinRoomFromClient.toString(), htmlElement.innerText);
                // Join
            };
            //delete all child elements of room list div
            //map something from data recevied
            //insert data to room list div
        });
        this.clientSocket.emit('get-rooms', 'hello');
        this.clientSocket.on('chess-select-piece', function (availableCells) {
            console.log('chess-select-piece called', availableCells);
            if (availableCells) {
                availableCells.forEach(c => {
                    var _a;
                    console.log('For Eaching available cells...', c);
                    (_a = document.getElementById(`${c.position.x},${c.position.y}`)) === null || _a === void 0 ? void 0 : _a.classList.add('movementAvailableCell');
                });
            }
        });
        this.clientSocket.on('chess-refresh-board', (data, team) => {
            console.log('chess-refresh-board');
            this.refreshChessPieces(JSON.stringify(data));
            this.setCurrentTurnText(team);
        });
        //@ts-ignore
        this.clientSocket.on('chess-setup-board', (data, team) => {
            this.createClientChessBoard();
            this.currentTurnDiv.innerText = team.toString();
            this.setupChessBoardByBoard(JSON.stringify(data));
        });
        this.multiplayChessDiv.onclick = (ev) => {
            let evtarget = ev.target;
            console.log('clicked-cell event', evtarget.getAttribute('id'));
            let clickedCellId = evtarget.getAttribute('id');
            if (clickedCellId) {
                let xy = clickedCellId.split(',');
                let x = parseInt(xy[0]);
                let y = parseInt(xy[1]);
                console.log('x', x);
                console.log('y', y);
                let cellSelectionInfo = { socketId: this.clientSocket.id, cell: this.currentClientBoard[x][y] };
                console.log(cellSelectionInfo);
                this.clientSocket.emit('clicked-cell', JSON.stringify(cellSelectionInfo));
            }
        };
    }
    // SetDebugGrid() {
    //     debugGrid[0][0]!.SetStandingPiece(new ChessGame.Piece(ChessGame.Team.North, ChessGame.PieceType.Rook, new ChessGame.Vector2(0, 0)));
    //     debugGrid[1][0]!.SetStandingPiece(new ChessGame.Piece(ChessGame.Team.North, ChessGame.PieceType.Rook, new ChessGame.Vector2(1, 0)));
    //     debugGrid[2][0]!.SetStandingPiece(new ChessGame.Piece(ChessGame.Team.North, ChessGame.PieceType.Pawn, new ChessGame.Vector2(2, 0)));
    //     setupChessBoardByBoard(JSON.stringify(debugGrid));
    // }
    createGrid() {
        let output = [];
        for (let i = 0; i < 8; i++) {
            let column = [];
            for (let j = 0; j < 8; j++) {
                column.push(new ChessGame.Cell(i, j));
            }
            output.push(column);
        }
        return output;
    }
    setCurrentTurnText(text) {
        if (this.currentTurnDiv) {
            this.currentTurnDiv.innerText = text.toString();
        }
    }
    offAllAvailableCells() {
        if (this.currentClientBoard) {
            this.currentClientBoard.forEach(y => {
                y.forEach(cell => {
                    let c = document.getElementById(`${cell === null || cell === void 0 ? void 0 : cell.position.x},${cell === null || cell === void 0 ? void 0 : cell.position.y}`);
                    if (c) {
                        if (c.classList.contains('movementAvailableCell')) {
                            c.classList.remove('movementAvailableCell');
                        }
                    }
                });
            });
        }
    }
    SetPiece(position, pieceType, team) {
        let cell = document.getElementById(`${position.x},${position.y}`);
        if (cell === null || cell === void 0 ? void 0 : cell.hasChildNodes()) {
            console.log('hasChildNOdes', cell);
            console.log('childnOdes:', cell.childNodes[0]);
            // cell.childNodes[0].remove();
            cell.removeChild(cell.childNodes[0]);
            console.log(cell.childNodes[0]);
        }
        if (pieceType) {
            if (cell) {
                // if (cell.hasChildNodes()) {
                //     console.log('hasChildNOdes', cell);
                //     console.log('childnOdes:', cell.childNodes[0]);
                //     // cell.childNodes[0].remove();
                //     cell.removeChild(cell.childNodes[0]);
                //     console.log(cell.childNodes[0]);
                // }
                let htmlElement = document.createElement('img');
                htmlElement.classList.add(pieceType.toString());
                htmlElement.classList.add("Piece");
                cell.append(htmlElement);
                if (team) {
                    htmlElement.classList.add(team.toString() + "Team");
                }
            }
        }
    }
    refreshChessPieces(board) {
        this.offAllAvailableCells();
        this.setupChessBoardByBoard(board);
    }
    setupChessBoardByBoard(board) {
        let cc = JSON.parse(board);
        this.currentClientBoard = cc;
        // let test: ChessGame.Cell = new ChessGame.Cell(1, 3);
        // console.log('test', test.GetStandingPiece());
        cc.forEach(yCell => {
            yCell.forEach(xCell => {
                var _a, _b;
                if (xCell) {
                    this.SetPiece(xCell.position, (_a = xCell.piece) === null || _a === void 0 ? void 0 : _a.pieceType, (_b = xCell.piece) === null || _b === void 0 ? void 0 : _b.team);
                }
            });
        });
    }
    createClientChessBoard() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let cellHTMLElement = document.createElement("button");
                let xRemainder = x % 2;
                let yRemainder = y % 2;
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
                cellHTMLElement.id = `${y},${x}`;
                cellHTMLElement.innerText = `${y},${x}`;
                let cell = new ChessGame.Cell(y, x);
                this.multiplayChessCellList.push(cell);
                this.multiplayChessDiv.append(cellHTMLElement);
            }
        }
        this.showMultiplayerChessBoardScreenOnly();
    }
    showMultiplayerChessBoardScreenOnly() {
        this.hideTitleScreen();
        this.hideJoinScreen();
        this.hideSinglePlayScreen();
    }
    hideTitleScreen() {
        if (this.titleScreen.classList.contains('hide') == false)
            this.titleScreen.classList.toggle('hide');
    }
    hideJoinScreen() {
        if (this.joinScreen.classList.contains('hide') == false)
            this.joinScreen.classList.toggle('hide');
    }
    hideSinglePlayScreen() {
        if (this.singlePlayScreen.classList.contains('hide') == false)
            this.singlePlayScreen.classList.toggle('hide');
    }
}
exports.ClientApp = ClientApp;
