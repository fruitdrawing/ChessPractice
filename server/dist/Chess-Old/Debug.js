"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
const auth_1 = require("firebase/auth");
const database_1 = require("firebase/database");
class Debug {
    constructor() {
        this.db = (0, database_1.getDatabase)();
        this.auth = (0, auth_1.getAuth)();
        // this.DoDebug();
        let button = document.getElementById("debugButton");
        button.addEventListener('click', () => {
            // console.log("Debug Button Pushed");
            // this.Move();
            (0, auth_1.signOut)(this.auth);
        });
    }
    DoDebug() {
        console.log("DEBUG START");
        this.img = document.createElement("image");
        let parent = document.getElementById("debugParent");
        parent.appendChild(this.img);
        this.img.classList.add("King");
        this.img.classList.add("Debug");
        this.img.style.zIndex = "3";
    }
    Move() {
        console.log("Move!");
        this.img.style.transform = "translate3d(300px,300px,0px)";
        //  console.log(this.img!.parentElement!.nodeName);
        //  console.log(this.img!.parentElement!.parentElement!.nodeName);
        console.log(this.img.style.transform);
    }
}
exports.Debug = Debug;
