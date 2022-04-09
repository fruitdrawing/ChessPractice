import { initializeApp } from 'firebase/app';
import { FirebaseApp } from 'firebase/app';
import { Database, DatabaseReference, DataSnapshot, getDatabase, ref, set } from "firebase/database";
import { onValue, onChildChanged, onChildRemoved } from "firebase/database";
import { push} from "firebase/database";
import { Auth, getAuth } from "firebase/auth";

export class FirebaseManager{
  firebaseConfig = {
    apiKey: "AIzaSyC8TP-6zxaTZN4pG2-MSncPhI-kE2K7L-8",
    authDomain: "jsfirebase-study.firebaseapp.com",
    databaseURL: "https://jsfirebase-study-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "jsfirebase-study",
    storageBucket: "jsfirebase-study.appspot.com",
    messagingSenderId: "290073694798",
    appId: "1:290073694798:web:24a7ef5081d388b6d3e91f"
    };

  db? : Database;
  app? : FirebaseApp;
  ref? : DatabaseReference;
  auth? : Auth;

  constructor()
  {
    this.app = initializeApp(this.firebaseConfig);
    this.db = getDatabase();
    this.ref = ref(this.db,'users/'+'testid');
    this.auth = getAuth();
    this.onValueChangedFunc();
    

  }

  writeUserData(userId : string, name : string, email:string, imageUrl:string) {
    if(this.db != undefined)
    set(ref(this.db, 'users/' + userId), {
      username: name,
      email: email,
      profile_picture : imageUrl
    });
  }
  
  onValueChangedFunc()
  {
    onValue(this.ref!,(snapshot : DataSnapshot)=> {
      let data : DataSnapshot = snapshot.val();
      console.log(data);
    })
  }
  


}


