"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChessApp_1 = require("./ChessApp");
const FirebaseManager_1 = require("./FirebaseManager");
const chessApp = new ChessApp_1.ChessApp();
(0, FirebaseManager_1.writeUserData)("GOGOGOGO", "mmomomomomo", "#!@#@!#", "123!");
exports.default = chessApp;
