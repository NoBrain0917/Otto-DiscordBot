export class Attachment {
    public isFile:boolean = false;
    public url!:string;
    public filename!:string;

    constructor(data:any){
        this.isFile = data[0]!=null;
        this.filename = data[0]?.filename;
        this.url = data[0]?.url;
    }
}