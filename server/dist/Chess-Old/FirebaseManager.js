"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseManager = void 0;
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
const database_2 = require("firebase/database");
const auth_1 = require("firebase/auth");
const ChessApp_1 = require("./ChessApp");
class FirebaseManager {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyC8TP-6zxaTZN4pG2-MSncPhI-kE2K7L-8",
            authDomain: "jsfirebase-study.firebaseapp.com",
            databaseURL: "https://jsfirebase-study-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "jsfirebase-study",
            storageBucket: "jsfirebase-study.appspot.com",
            messagingSenderId: "290073694798",
            appId: "1:290073694798:web:24a7ef5081d388b6d3e91f"
        };
        this.app = (0, app_1.initializeApp)(this.firebaseConfig);
        this.db = (0, database_1.getDatabase)();
        this.ref = (0, database_1.ref)(this.db, 'users/' + 'testid');
        this.auth = (0, auth_1.getAuth)();
        this.googleProvider = new auth_1.GoogleAuthProvider();
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == 37) {
                if (this.auth.currentUser) {
                    (0, database_1.set)((0, database_1.ref)(this.db, "matchmaking"), {
                        name: {
                            name: this.auth.currentUser.displayName,
                            team: ChessApp_1.Team.North
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
        this.loginButton = document.getElementById("loginButton");
        this.loginButton.addEventListener('click', () => {
            // this.signInAnony();
            (0, auth_1.signInWithPopup)(this.auth, this.googleProvider).then((result) => {
                const credential = auth_1.GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
            });
        });
        this.onAuthStateChanged();
    }
    writeUserData(userId, name, email, imageUrl) {
        if (this.db != undefined)
            (0, database_1.set)((0, database_1.ref)(this.db, 'users/' + userId), {
                username: name,
                email: email,
                profile_picture: imageUrl
            });
    }
    createNewUser(userId, password) {
        (0, auth_1.createUserWithEmailAndPassword)(this.auth, userId, password).then((userCredential) => {
            const user = userCredential.user;
        })
            .catch((error) => {
        });
    }
    onValueChangedFunc() {
        (0, database_2.onValue)(this.ref, (snapshot) => {
            let data = snapshot.val();
            alert(data);
        });
    }
    offValueChangedFunc() {
    }
    onAuthStateChanged() {
        (0, auth_1.onAuthStateChanged)(this.auth, (user) => {
            if (user) {
                const uid = user === null || user === void 0 ? void 0 : user.uid;
                console.log("Signed in !");
                this.loginButton.innerHTML = "Sign Out";
                this.ref = (0, database_1.ref)(this.db, `users/${user.uid}`);
                //로그인 정보 넣기 !
                const profileImg = document.getElementById("profileImage");
                // profileImg.src = user.photoURL;
                console.log(user.photoURL);
                profileImg.src = user.photoURL;
                const loginMessage = document.getElementById("loginMessage");
                loginMessage.innerHTML = `Welcome, ${user.displayName}`;
                (0, database_1.set)((0, database_1.ref)(this.db, `users/${user.uid}`), {
                    uid: user.uid,
                    name: user.email,
                    displayName: user.displayName
                });
                (0, database_2.onDisconnect)(this.ref).remove();
                this.onValueChangedFunc();
            }
            else {
                const loginMessage = document.getElementById("loginMessage");
                loginMessage.innerHTML = "";
                console.log("not signed in");
                this.loginButton.innerHTML = "Sign In";
                const profileImg = document.getElementById("profileImage");
                // profileImg.src = user.photoURL;
                profileImg.src = '';
            }
        });
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
        (0, auth_1.signInAnonymously)(this.auth).then(() => {
            console;
        })
            .catch((error) => {
            const errorCode = error.code;
        });
    }
    signOut() {
    }
}
exports.FirebaseManager = FirebaseManager;
