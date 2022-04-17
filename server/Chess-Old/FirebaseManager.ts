import { initializeApp } from 'firebase/app';
import { FirebaseApp } from 'firebase/app';
import { Database, DatabaseReference, DataSnapshot, getDatabase, onChildAdded, ref, set ,get} from "firebase/database";
import { onValue, onChildChanged, onChildRemoved, onDisconnect } from "firebase/database";
import { push } from "firebase/database";
import { GoogleAuthProvider, Auth, getAuth, signInAnonymously, onAuthStateChanged, signInWithPopup, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { Team } from './ChessApp';

export class FirebaseManager {
  firebaseConfig = {
    apiKey: "AIzaSyC8TP-6zxaTZN4pG2-MSncPhI-kE2K7L-8",
    authDomain: "jsfirebase-study.firebaseapp.com",
    databaseURL: "https://jsfirebase-study-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "jsfirebase-study",
    storageBucket: "jsfirebase-study.appspot.com",
    messagingSenderId: "290073694798",
    appId: "1:290073694798:web:24a7ef5081d388b6d3e91f"
  };

  db: Database;
  app: FirebaseApp;
  ref: DatabaseReference;
  auth: Auth;
  loginButton: HTMLElement;
  googleProvider: GoogleAuthProvider;

  constructor() {

    this.app = initializeApp(this.firebaseConfig);
    this.db = getDatabase();
    this.ref = ref(this.db, 'users/' + 'testid');
    this.auth = getAuth();
    this.googleProvider = new GoogleAuthProvider();
   
    document.addEventListener('keydown', (event) => {
      if (event.keyCode == 37) {
        if (this.auth.currentUser) {
          set(ref(this.db, "matchmaking"), {
            name: {
              name: this.auth.currentUser.displayName,
              team: Team.North
            }

          });
        }
        else {
          alert('로그안 안 돼어있음');
        }

      }
      else if (event.keyCode == 39) {
      }
    });

    this.loginButton = document.getElementById("loginButton")!;
    this.loginButton.addEventListener('click', () => {
      // this.signInAnony();
      signInWithPopup(this.auth!, this.googleProvider!).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;

      });
    });
    this.onAuthStateChanged();
  }


  writeUserData(userId: string, name: string, email: string, imageUrl: string) {
    if (this.db != undefined)
      set(ref(this.db, 'users/' + userId), {
        username: name,
        email: email,
        profile_picture: imageUrl
      });
  }

  createNewUser(userId: string, password: string) {
    createUserWithEmailAndPassword(this.auth, userId, password).then((userCredential) => {
      const user = userCredential.user;
    })
      .catch((error) => {

      });
  }

  onValueChangedFunc() {
    onValue(this.ref!, (snapshot: DataSnapshot) => {
      let data: DataSnapshot = snapshot.val();
      alert(data);
    })
  }

  offValueChangedFunc() {

  }

  onAuthStateChanged() {
    onAuthStateChanged(this.auth!, (user) => {
      if (user) {
        const uid = user?.uid;
        console.log("Signed in !");
        this.loginButton!.innerHTML = "Sign Out";
        this.ref = ref(this.db!, `users/${user.uid}`);

        //로그인 정보 넣기 !

        const profileImg: HTMLImageElement = document.getElementById("profileImage") as HTMLImageElement;
        // profileImg.src = user.photoURL;
        console.log(user.photoURL);
        profileImg.src = user.photoURL!;

        const loginMessage = document.getElementById("loginMessage")!;
        loginMessage.innerHTML = `Welcome, ${user.displayName}`;
        set(ref(this.db!, `users/${user.uid}`), {
          uid: user.uid,
          name: user.email,
          displayName: user.displayName
        });


        onDisconnect(this.ref).remove();
        this.onValueChangedFunc();

      }
      else {
        const loginMessage = document.getElementById("loginMessage")!;
        loginMessage.innerHTML = "";
        console.log("not signed in");
        this.loginButton!.innerHTML = "Sign In";


        const profileImg: HTMLImageElement = document.getElementById("profileImage") as HTMLImageElement;
        // profileImg.src = user.photoURL;
        profileImg.src = '';

      }
    }
    );

  }

  onMatchMaking() {
    if (this.auth.currentUser) {
      console.log("YOU ARE LOGGEDN IN");
    }
    else {
      console.log("NOOOO");
    }
    // set(ref(this.db!, `matchmaking/${}`))
  }

  signInAnony() {
    signInAnonymously(this.auth!).then(() => {
      console
    })
      .catch((error) => {
        const errorCode = error.code;

      });
  }

  signOut() {

  }

}


