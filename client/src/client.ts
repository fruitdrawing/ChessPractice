import { json } from "express";
import * as ChessGame from "../../server/Chess"
// import { CellSelectionInfo } from "../../server/ServerManager"
import type { Board } from "../../server/Chess/index"
import { DebugManager } from "./DebugManager";
// import { SocketIOClient } from "./SocketIOClient";
import { io, Socket } from "socket.io-client";
import { SocketIOEventEnum } from "../../server/ServerEnum";


export class ClientApp {
    debugManager: DebugManager = new DebugManager();
    // socketIOClient : SocketIOClient = new SocketIOClient();

    clientNickName: string = "";
    //"http://localhost:3001"
    clientSocket: Socket = io();
    hostButton = document.getElementById("host-button");
    multiplayChessCellList: ChessGame.Cell[] = [];
    currentClientBoard: Board = this.createGrid();

    multiplayChessDiv = document.getElementById("multiplayer-chessboard")
    nickNameSubmitButton: HTMLButtonElement = document.getElementById("nickname-submit-button") as HTMLButtonElement;
    nickNameDisplayElement: HTMLParagraphElement = document.getElementById('nickname-display') as HTMLParagraphElement;
    roomlist: HTMLDivElement = document.getElementById("room-list") as HTMLDivElement;
    currentTurnDiv: HTMLSpanElement = document.getElementById("current-turn-div") as HTMLSpanElement;

    titleScreen: HTMLDivElement = document.getElementById("mainScreen") as HTMLDivElement;
    joinScreen: HTMLDivElement = document.getElementById("joinScreen") as HTMLDivElement;
    singlePlayScreen: HTMLDivElement = document.getElementById("singlePlayScreen") as HTMLDivElement;
    multiplayerScreen: HTMLDivElement = document.getElementById("multiplayerScreen") as HTMLDivElement;

    constructor() {
        console.log('init client');
        this.HTMLSetup();
    }
    HTMLSetup() {
        this.nickNameSubmitButton.addEventListener('click', () => {
            let nickNameInput: HTMLInputElement = document.getElementById("nick-name-input") as HTMLInputElement;
            this.clientSocket.emit(SocketIOEventEnum.nickNameChangedFromClient.toString(), nickNameInput.value);
        });

        this.clientSocket.on(SocketIOEventEnum.nickNameChangedFromClient.toString(), (nickName) => {
            this.clientNickName = nickName;
            this.nickNameDisplayElement.innerText = nickName;
        });

        this.hostButton!.addEventListener('click', () => {
            // console.log("host button clicked!");
            let roomTitleInput: HTMLInputElement = document.getElementById("room-title-input") as HTMLInputElement;
            // console.log('innerHTML', roomTitleInput.innerHTML);
            if (roomTitleInput.value.length > 3) {
                this.clientSocket.emit(SocketIOEventEnum.createRoomFromClient, {
                    roomTitle: roomTitleInput.value,
                    teamOfHost: "North",
                    hostNickName: this.clientNickName
                });
                roomTitleInput.value = "";
            } else {
                alert('you need a Room title longer than 3 characters!')
            }
        });


        // * Player joined a room
        this.clientSocket.on(SocketIOEventEnum.playerJoined.toString(), (data) => {
            console.log('player-joined event:', data);
            this.clientSocket.emit('chess-setup-board');
        });

        //Room List
        this.clientSocket.on('rooms', (data) => {
            // rooms = data;
            console.log('client Socket id:', this.clientSocket.id);
            console.log('recevied rooms!!!!!!!!');
            console.log('data:', data);
            this.roomlist!.innerText = "";
            this.roomlist!.append(...data.filter((room: any) => room.socketId !== this.clientSocket.id).map((room: any, index: number) => {
                let button = document.createElement('button');
                button.setAttribute('class', 'room-list-button');
                button.setAttribute('id', 'room-' + index);
                button.innerText = room.roomTitle;
                return button;
            }));

            //Global
            this.roomlist!.onclick = (ev: MouseEvent) => {
                // console.log("room button clicked! id:", ev.target.getAttribute('id'));
                // createChessBoard();
                let htmlElement = ev.target as HTMLButtonElement;
                console.log('roomlist', ev);
                console.log('htmlElement', htmlElement);
                console.log('htmlElement.innerText', htmlElement.innerText);
                this.clientSocket.emit(SocketIOEventEnum.joinRoomFromClient.toString(), htmlElement.innerText);
                // Join
            };


            //delete all child elements of room list div

            //map something from data recevied

            //insert data to room list div
        });

        this.clientSocket.emit('get-rooms', 'hello');



        this.clientSocket.on('chess-select-piece', function (availableCells: ChessGame.Cell[] | undefined) {
            console.log('chess-select-piece called', availableCells)
            if (availableCells) {
                availableCells.forEach(c => {
                    console.log('For Eaching available cells...', c);
                    document.getElementById(`${c.position.x},${c.position.y}`)?.classList.add('movementAvailableCell');
                });
            }
        });

        this.clientSocket.on('chess-refresh-board', (data: Board, team: ChessGame.Team) => {
            console.log('chess-refresh-board');
            this.refreshChessPieces(JSON.stringify(data));
            this.setCurrentTurnText(team);
        });

        //@ts-ignore
        this.clientSocket.on('chess-setup-board', (data: Board, team: ChessGame.Team) => {
            this.createClientChessBoard();
            this.currentTurnDiv.innerText = team.toString();
            this.setupChessBoardByBoard(JSON.stringify(data));
        });

        this.multiplayChessDiv!.onclick = (ev: MouseEvent) => {
            let evtarget: HTMLButtonElement = ev.target as HTMLButtonElement;
            console.log('clicked-cell event', evtarget.getAttribute('id'));
            let clickedCellId: string | null = evtarget.getAttribute('id');
            if (clickedCellId) {
                let xy = clickedCellId.split(',');
                let x: number = parseInt(xy[0])
                let y: number = parseInt(xy[1])
                console.log('x', x);
                console.log('y', y);

                let cellSelectionInfo = { socketId: this.clientSocket.id, cell: this.currentClientBoard[x][y]! };
                console.log(cellSelectionInfo);
                this.clientSocket.emit('clicked-cell', JSON.stringify(cellSelectionInfo));

            }
        }

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
    setCurrentTurnText(text: ChessGame.Team) {
        if (this.currentTurnDiv) {
            this.currentTurnDiv.innerText = text.toString();
        }
    }

    offAllAvailableCells() {
        if (this.currentClientBoard) {
            this.currentClientBoard.forEach(y => {
                y.forEach(cell => {
                    let c = document.getElementById(`${cell?.position.x},${cell?.position.y}`);
                    if (c) {
                        if (c.classList.contains('movementAvailableCell')) {
                            c.classList.remove('movementAvailableCell');
                        }
                    }
                })
            })
        }
    }

    SetPiece(position: ChessGame.Vector2, pieceType: ChessGame.PieceType | undefined, team: ChessGame.Team | undefined) {
        let cell = document.getElementById(`${position.x},${position.y}`);

        if (cell?.hasChildNodes()) {
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
                let htmlElement: HTMLImageElement = document.createElement('img');
                htmlElement.classList.add(pieceType.toString());
                htmlElement.classList.add("Piece");
                cell.append(htmlElement);
                if (team) {
                    htmlElement.classList.add(team.toString() + "Team");
                }
            }
        }

    }
    refreshChessPieces(board: string) {
        this.offAllAvailableCells();
        this.setupChessBoardByBoard(board);
    }

    setupChessBoardByBoard(board: string) {
        let cc: Board = JSON.parse(board);
        this.currentClientBoard = cc;
        // let test: ChessGame.Cell = new ChessGame.Cell(1, 3);
        // console.log('test', test.GetStandingPiece());
        cc.forEach(yCell => {
            yCell.forEach(xCell => {
                if (xCell) {

                    this.SetPiece(xCell.position, xCell.piece?.pieceType, xCell.piece?.team);
                }
            })
        });
    }

    createClientChessBoard() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let cellHTMLElement: HTMLButtonElement = document.createElement("button");

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

                let cell: ChessGame.Cell = new ChessGame.Cell(y, x);
                this.multiplayChessCellList.push(cell);
                this.multiplayChessDiv!.append(cellHTMLElement);

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


