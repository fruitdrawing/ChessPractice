export class Debug{
    img? : HTMLElement
    constructor()
    {
      this.DoDebug();
      let button = document.getElementById("firebaseTest")!;
      button.addEventListener('click', () => {
          console.log("Debug Button Pushed");
          this.Move();
      });
    }
    DoDebug()
    {
      console.log("DEBUG START");
        this.img = document.createElement("image");
        let parent = document.getElementById("debugParent")!;
        parent.appendChild(this.img);
        this.img.classList.add("King");
        this.img.classList.add("Debug");
        this.img.style.zIndex = "3";
    }
    Move()
    {
       console.log("Move!");
       this.img!.style.transform = "translate3d(300px,300px,0px)";
      //  console.log(this.img!.parentElement!.nodeName);
      //  console.log(this.img!.parentElement!.parentElement!.nodeName);
       console.log(this.img!.style.transform);
    }
}

