export abstract class EventSender{
    abstract attach() : void;
    abstract detach() : void
    abstract notify() : void
}

class EventS extends EventSender{
    subject : number;
    
    attach(): void {
        throw new Error("Method not implemented.");
    }
    detach(): void {
        throw new Error("Method not implemented.");
    }
    notify(): void {
        throw new Error("Method not implemented.");
    }

}

export class EventReceiver{
    update() : void {

    }
}



