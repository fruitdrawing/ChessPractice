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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellSelectionInfo = exports.ServerManager = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const ChessGame = __importStar(require("./Chess/index"));
const ServerEnum_1 = require("./ServerEnum");
const helmet_1 = __importDefault(require("helmet"));
class ServerManager {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = new http_1.default.Server(this.app);
        this.serverio = new socket_io_1.Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.port = process.env.PORT || 3000;
        this.serverRooms = [];
        console.log("init");
        this.app.use(express_1.default.static('./client/dist'));
        this.app.use((0, helmet_1.default)());
        this.server.listen(this.port, () => {
            console.log(`listening on port ${this.port}`);
        });
        this.Init();
    }
    Init() {
        this.serverio.on(ServerEnum_1.SocketIOEventEnum.connection.toString(), (clientSocket) => {
            // * Create Room
            console.log('socket id : ' + clientSocket.id);
            clientSocket.on(ServerEnum_1.SocketIOEventEnum.createRoomFromClient.toString(), (data) => {
                this.serverRooms.push(Object.assign(Object.assign({}, data), { hostingSocket: clientSocket, hostSocketId: clientSocket.id }));
                clientSocket.join(data.roomTitle);
                console.log(data);
                // serverSocket.to(data.roomTitle).emit('game-started', true);
                console.log('created room!');
                this.serverio.emit('rooms', this.GetRooms());
            });
            // * Player Joined a room
            clientSocket.on(ServerEnum_1.SocketIOEventEnum.joinRoomFromClient.toString(), (roomTitle) => {
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
                    this.serverRooms = this.serverRooms.map((room) => room.roomTitle === roomTitle ? Object.assign(Object.assign({}, room), { isPlaying: true }) : room);
                    this.serverio.emit('rooms', this.GetRooms());
                    this.serverio.to(roomTitle).emit(ServerEnum_1.SocketIOEventEnum.playerJoined.toString(), clientSocket.id);
                }
            });
            // * Request Room List
            clientSocket.on('get-rooms', () => {
                console.log('get-rooms called!');
                clientSocket.emit('rooms', this.GetRooms());
            });
            this.StartGame(clientSocket);
            // * NickName Changed
            clientSocket.on(ServerEnum_1.SocketIOEventEnum.nickNameChangedFromClient.toString(), (data) => {
                console.log('nickname changed to:', data);
                clientSocket.emit(ServerEnum_1.SocketIOEventEnum.nickNameChangedFromClient.toString(), data);
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
    StartGame(clientSocket) {
        // * Chess Setup Board
        //@ts-ignore
        clientSocket.on('chess-setup-board', (socket) => {
            // clientSocket.to()
            console.log('chess-setup-board called');
            let hostRoom = this.serverRooms.find((room) => room.hostSocketId == clientSocket.id);
            if (!hostRoom) {
                return;
            }
            hostRoom.chessGameInfo = new ChessGame.ChessGameInfo(clientSocket.id, hostRoom.joinedUserSocketId);
            this.serverio.to(hostRoom.roomTitle).emit('chess-setup-board', hostRoom.chessGameInfo.grid, hostRoom.chessGameInfo.CurrentTurn);
        });
        // * Clicked Cell
        clientSocket.on('clicked-cell', (data) => {
            let receivedData = JSON.parse(data);
            console.log('clicked-cell', receivedData);
            if (!receivedData)
                return;
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
                                    let availableCells = currentRoom.chessGameInfo.GetAvailableCells(currentRoom.chessGameInfo.GetTeamBySocket(receivedData.socketId), receivedData.cell.piece);
                                    currentRoom.chessGameInfo.CurrentAvailableCells = availableCells;
                                    console.log('availableCells', availableCells);
                                    if (availableCells) {
                                        let currentSelectedPiece = receivedData.cell.piece;
                                        if (currentSelectedPiece) {
                                            currentRoom.chessGameInfo.SetCurrentSelectedPiece(currentSelectedPiece);
                                        }
                                        console.log('emiting..to roomtitle :', currentRoom.roomTitle);
                                        this.serverio.to(receivedData.socketId).emit('chess-select-piece', availableCells);
                                        currentRoom.chessGameInfo.CurrentGameState = ChessGame.GameState.WaitingForAvailableCellClickToMove;
                                    }
                                }
                            }
                            break;
                        case ChessGame.GameState.WaitingForAvailableCellClickToMove:
                            console.log('WaitinfForAvailableCellState');
                            let currentAvailableCells = currentRoom.chessGameInfo.CurrentAvailableCells;
                            console.log('currentAvailableCells:', currentAvailableCells);
                            if (currentAvailableCells) {
                                let foundCell = currentAvailableCells.find(c => c.position.x === receivedData.cell.position.x && c.position.y === receivedData.cell.position.y);
                                console.log('receivedData', receivedData.cell.position);
                                console.log('foundCell', foundCell);
                                if (foundCell) {
                                    // * SUCESS
                                    console.log('success!');
                                    if (receivedData.cell.piece === undefined) {
                                        if (currentRoom.chessGameInfo.CurrentSelectedPiece) {
                                            // * Move
                                            let from = currentRoom.chessGameInfo.CurrentSelectedPiece.position;
                                            console.log(from);
                                            currentRoom.chessGameInfo.Move(currentRoom.chessGameInfo.CurrentSelectedPiece, receivedData.cell, currentRoom.chessGameInfo.GetCellByPosition(from));
                                            console.log('move success !! !  !! ');
                                        }
                                    }
                                    else {
                                        // * KILL
                                        if (currentRoom.chessGameInfo.CurrentSelectedPiece) {
                                            // * Move
                                            let from = currentRoom.chessGameInfo.CurrentSelectedPiece.position;
                                            currentRoom.chessGameInfo.Move(currentRoom.chessGameInfo.CurrentSelectedPiece, receivedData.cell, currentRoom.chessGameInfo.GetCellByPosition(from));
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
            return { roomTitle, isPlaying, teamOfHost, socketId, hostNickName, chessGameInfo };
        });
    }
    GetRoomByHostSocketId(hostSocketId) {
        return this.serverRooms.find((room) => room.hostSocketId === hostSocketId);
    }
    GetRoomByRoomTitle(roomTitle) {
        return this.serverRooms.find((room) => room.roomTitle === roomTitle);
    }
    GetRoomByAnySocketId(socketId) {
        return this.serverRooms.find((room) => room.hostSocketId === socketId || room.joinedUserSocketId == socketId);
    }
}
exports.ServerManager = ServerManager;
class CellSelectionInfo {
    constructor(socket, piece) {
        this.socketId = socket;
        this.cell = piece;
    }
}
exports.CellSelectionInfo = CellSelectionInfo;
class Command {
    constructor(from) {
        this.from = from;
    }
}
