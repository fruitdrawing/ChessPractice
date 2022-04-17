import { Auth, getAuth, signOut } from "firebase/auth";
import { FirebaseApp } from 'firebase/app';
import { DatabaseReference, Database, getDatabase, set, ref } from "firebase/database";
export class Debug {
  img?: HTMLElement
  app?: FirebaseApp;
  auth: Auth;
  ref?: DatabaseReference;
  db?: Database;
  constructor() {
    this.db = getDatabase();
    this.auth = getAuth();
    // this.DoDebug();
    let button = document.getElementById("debugButton")!;
    button.addEventListener('click', () => {
      // console.log("Debug Button Pushed");
      // this.Move();
      signOut(this.auth);
    });
  }
  DoDebug() {
    console.log("DEBUG START");
    this.img = document.createElement("image");
    let parent = document.getElementById("debugParent")!;
    parent.appendChild(this.img);
    this.img.classList.add("King");
    this.img.classList.add("Debug");
    this.img.style.zIndex = "3";
  }
  Move() {
    console.log("Move!");
    this.img!.style.transform = "translate3d(300px,300px,0px)";
    //  console.log(this.img!.parentElement!.nodeName);
    //  console.log(this.img!.parentElement!.parentElement!.nodeName);
    console.log(this.img!.style.transform);
  }
}

