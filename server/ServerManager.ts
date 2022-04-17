import express from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';
import * as ChessGame from './Chess/index';
import { SocketIOEventEnum } from './ServerEnum';

export class ServerManager {
    app = express();
    server = new http.Server(this.app);
    serverio = new Server(this.server, {
        cors:
        {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    port = process.env.PORT || 3000;
    serverRooms: ChessRoom[] = [];
    constructor() {
        console.log("init");
        this.app.use(express.static('./client/dist'));
        this.server.listen(this.port, () => {
            console.log(`listening on port ${this.port}`)
        });
        this.Init();

    }
    Init() {
        this.serverio.on(SocketIOEventEnum.connection.toString(), (clientSocket: Socket) => {

            // * Create Room
            console.log('socket id : ' + clientSocket.id);
            clientSocket.on(SocketIOEventEnum.createRoomFromClient.toString(), (data) => {
                this.serverRooms.push({ ...data, hostingSocket: clientSocket, hostSocketId: clientSocket.id });
                clientSocket.join(data.roomTitle);
                console.log(data);
                // serverSocket.to(data.roomTitle).emit('game-started', true);
                console.log('created room!');
                this.serverio.emit('rooms', this.GetRooms());
            });

            // * Player Joined a room
            clientSocket.on(SocketIOEventEnum.joinRoomFromClient.toString(), (roomTitle) => {
                clientSocket.join(roomTitle);
                let foundRoom = this.GetRoomByRoomTitle(roomTitle);
                // console.log(roomTitle);
                // let ee = GetRooms().find((room) => room.roomTitle === roomTitle);
                // console.log('ee', ee);
                // console.log(foundRoom);
                // rooms.forEach(r => console.log(r.roomTitle));

                if (foundRoom) {
                    // console.log(foundRoom)   
                    foundRoom.joinedUserSocketId = clientSocket.id;
                    this.serverRooms = this.serverRooms.map((room) => room.roomTitle === roomTitle ? { ...room, isPlaying: true } : room);
                    this.serverio.emit('rooms', this.GetRooms());
                    this.serverio.to(roomTitle).emit(SocketIOEventEnum.playerJoined.toString(), clientSocket.id);
                }

            });

            // * Request Room List
            clientSocket.on('get-rooms', () => {
                console.log('get-rooms called!');
                clientSocket.emit('rooms', this.GetRooms());
            });


            this.StartGame(clientSocket);

            // * NickName Changed
            clientSocket.on(SocketIOEventEnum.nickNameChangedFromClient.toString(), (data) => {
                console.log('nickname changed to:', data);
                clientSocket.emit(SocketIOEventEnum.nickNameChangedFromClient.toString(), data);
            });

            // ! Disconnect
            clientSocket.on('disconnect', () => {
                this.serverRooms = this.serverRooms.filter(function (i) {
                    return i.hostingSocket !== clientSocket;
                });
                this.serverio.emit('rooms', this.GetRooms());
                console.log('user disconnected');
            });
        });

    }
    StartGame(clientSocket: Socket) {
        // * Chess Setup Board
        //@ts-ignore
        clientSocket.on('chess-setup-board', (socket: Socket) => {
            // clientSocket.to()
            console.log('chess-setup-board called');
            let hostRoom: ChessRoom = this.serverRooms.find((room) => room.hostSocketId == clientSocket.id)!;
            if (!hostRoom) {
                return;
            }

            hostRoom.chessGameInfo = new ChessGame.ChessGameInfo(clientSocket.id, hostRoom.joinedUserSocketId);
            this.serverio.to(hostRoom.roomTitle).emit('chess-setup-board', hostRoom.chessGameInfo.grid, hostRoom.chessGameInfo.CurrentTurn);
        });

        // * Clicked Cell
        clientSocket.on('clicked-cell', (data: string) => {

            let receivedData: CellSelectionInfo = JSON.parse(data);
            console.log('clicked-cell', receivedData);
            if (!receivedData) return;
            let currentRoom = this.GetRoomByAnySocketId(receivedData.socketId);
            // console.log('clicked-cell-currentRoom', currentRoom);
            if (currentRoom) {
                if (currentRoom.chessGameInfo.CurrentTurn === currentRoom.chessGameInfo.GetTeamBySocket(receivedData.socketId)) {

                    // console.log('currentTeam', currentRoom.chessGameInfo.GetTeamBySocket(receivedData.socketId))
                    // console.log('currentGameState', currentRoom.chessGameInfo.CurrentGameState);
                    switch (currentRoom.chessGameInfo.CurrentGameState) {
                        case ChessGame.GameState.WaitingForPieceSelection:
                            if (receivedData.cell.piece) {
                                if (receivedData.cell.piece.team == currentRoom.chessGameInfo.CurrentTurn) {
                                    let availableCells: ChessGame.Cell[] | undefined =
                                        currentRoom.chessGameInfo.GetAvailableCells(currentRoom.chessGameInfo.GetTeamBySocket(receivedData.socketId)!,
                                            receivedData.cell.piece);
                                    currentRoom.chessGameInfo.CurrentAvailableCells = availableCells;
                                    console.log('availableCells', availableCells);
                                    if (availableCells) {
                                        let currentSelectedPiece = receivedData.cell.piece;
                                        if (currentSelectedPiece) {
                                            currentRoom.chessGameInfo.SetCurrentSelectedPiece(currentSelectedPiece);
                                        }
                                        console.log('emiting..to roomtitle :', currentRoom.roomTitle)
                                        this.serverio.to(receivedData.socketId).emit('chess-select-piece', availableCells);
                                        currentRoom.chessGameInfo.CurrentGameState = ChessGame.GameState.WaitingForAvailableCellClickToMove;
                                    }
                                }
                            }

                            break;




                        case ChessGame.GameState.WaitingForAvailableCellClickToMove:
                            console.log('WaitinfForAvailableCellState')
                            let currentAvailableCells: ChessGame.Cell[] | undefined = currentRoom.chessGameInfo.CurrentAvailableCells;
                            console.log('currentAvailableCells:', currentAvailableCells);
                            if (currentAvailableCells) {

                                let foundCell = currentAvailableCells.find(c => c.position.x === receivedData.cell.position.x && c.position.y === receivedData.cell.position.y);
                                console.log('receivedData', receivedData.cell.position)
                                console.log('foundCell', foundCell);
                                if (foundCell) {
                                    // * SUCESS
                                    console.log('success!');
                                    if (receivedData.cell.piece === undefined) {
                                        if (currentRoom.chessGameInfo.CurrentSelectedPiece) {
                                            // * Move
                                            let from: ChessGame.Vector2 = currentRoom.chessGameInfo.CurrentSelectedPiece.position;
                                            console.log(from);

                                            currentRoom.chessGameInfo.Move(currentRoom.chessGameInfo.CurrentSelectedPiece, receivedData.cell, currentRoom.chessGameInfo.GetCellByPosition(from)!);
                                            console.log('move success !! !  !! ');
                                        }
                                    }
                                    else {

                                        // * KILL
                                        if (currentRoom.chessGameInfo.CurrentSelectedPiece) {

                                            // * Move
                                            let from: ChessGame.Vector2 = currentRoom.chessGameInfo.CurrentSelectedPiece.position;
                                            currentRoom.chessGameInfo.Move(currentRoom.chessGameInfo.CurrentSelectedPiece, receivedData.cell, currentRoom.chessGameInfo.GetCellByPosition(from)!);
                                            console.log('kill success !! !  !! ');

                                        }
                                    }
                                    currentRoom.chessGameInfo.ToggleCurrentTurn();
                                    // * EMIT NEW BOARD
                                    currentRoom.chessGameInfo.CurrentGameState = ChessGame.GameState.WaitingForPieceSelection;
                                    this.serverio.to(currentRoom.roomTitle).emit('chess-refresh-board', currentRoom.chessGameInfo.grid, currentRoom.chessGameInfo.CurrentTurn);
                                }
                                else {
                                    break;
                                }

                            }

                            break;
                    }

                }
                else {
                    //Do Nothing

                }
            }

        });

    }

    GetRooms() {
        return this.serverRooms.filter((room) => !room.isPlaying).map(function ({ roomTitle, isPlaying, teamOfHost, hostSocketId: socketId, hostNickName, chessGameInfo }) {
            return { roomTitle, isPlaying, teamOfHost, socketId, hostNickName, chessGameInfo }
        });
    }

    GetRoomByHostSocketId(hostSocketId: string): ChessRoom | undefined {
        return this.serverRooms.find((room) => room.hostSocketId === hostSocketId);
    }

    GetRoomByRoomTitle(roomTitle: string): ChessRoom | undefined {
        return this.serverRooms.find((room) => room.roomTitle === roomTitle);
    }

    GetRoomByAnySocketId(socketId: string): ChessRoom | undefined {
        return this.serverRooms.find((room) => room.hostSocketId === socketId || room.joinedUserSocketId == socketId);
    }

}

interface ChessRoom {
    roomTitle: string;
    isPlaying: boolean;
    hostingSocket: any;
    teamOfHost: ChessGame.Team;
    hostSocketId: string;
    joinedUserSocketId: string;
    hostNickName: string;
    chessGameInfo: ChessGame.ChessGameInfo;
}


export class CellSelectionInfo {
    socketId: string;
    cell: ChessGame.Cell;
    constructor(socket: string, piece: ChessGame.Cell) {
        this.socketId = socket;
        this.cell = piece;
    }
}

class Command {
    from: ChessGame.Vector2;
    constructor(from: ChessGame.Vector2) {
        this.from = from;
    }
}

