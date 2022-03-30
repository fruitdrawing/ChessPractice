export class CellSelector {
    name: string;
    hp: number;

    constructor(name:string,hp:number){}

    set setName(value:string)
    {
        this.name = value;
    }
    DoSomething()
    {
        this.setName = "asd";
    }
}

