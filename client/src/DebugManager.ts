import * as client from './client';

export class DebugManager {
    dialog: HTMLDialogElement = document.getElementById('modal') as HTMLDialogElement;
    constructor() {
        this.DoDebugMode();
    }
    DoDebugMode() {

        document.addEventListener('keydown', (key) => {
            // * a
            if (key.keyCode === 65) {




            }

            // * s
            if (key.keyCode === 83) {
                console.log('s pressed');
                let a = document.getElementById("0,0");
                a?.removeChild(a.childNodes[0]);
            }
        });
    }
}