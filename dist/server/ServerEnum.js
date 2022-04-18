"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOEventEnum = void 0;
var SocketIOEventEnum;
(function (SocketIOEventEnum) {
    SocketIOEventEnum["connection"] = "connection";
    SocketIOEventEnum["createRoomFromClient"] = "createRoomFromClient";
    SocketIOEventEnum["sendRoomListToClient"] = "sendRoomListToClient";
    SocketIOEventEnum["joinRoomFromClient"] = "joinRoomFromClient";
    SocketIOEventEnum["nickNameChangedFromClient"] = "nickNameChangedFromClient";
    SocketIOEventEnum["playerJoined"] = "playerJoined";
    SocketIOEventEnum["chessBoardSetup"] = "chessBoardSetup";
})(SocketIOEventEnum = exports.SocketIOEventEnum || (exports.SocketIOEventEnum = {}));
