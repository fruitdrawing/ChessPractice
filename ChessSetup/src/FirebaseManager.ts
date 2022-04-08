import { initializeApp } from 'firebase/app';
import { FirebaseApp } from 'firebase/app';
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyC8TP-6zxaTZN4pG2-MSncPhI-kE2K7L-8",
    authDomain: "jsfirebase-study.firebaseapp.com",
    databaseURL: "https://jsfirebase-study-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "jsfirebase-study",
    storageBucket: "jsfirebase-study.appspot.com",
    messagingSenderId: "290073694798",
    appId: "1:290073694798:web:24a7ef5081d388b6d3e91f"
    };

const app : FirebaseApp = initializeApp(firebaseConfig);
console.log(99999);

export function writeUserData(userId : string, name : string, email:string, imageUrl:string) {
  const db = getDatabase();
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

console.log(12314);
const buttonTT = document.getElementById("firebaseTest")!;
console.log(buttonTT);

buttonTT.addEventListener('click', () =>
{
    console.log("CLICKed ! ! !");
    writeUserData("NNN","MMM","WWWW@WWWW","QEQEQE");
});

