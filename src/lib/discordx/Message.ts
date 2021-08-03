
import { Attachment } from "./Attachment";
import { Author } from "./Author";
import { Channel } from "./Channel";
import { Guild } from "./Guild";
import { Member } from "./Member";

export class Message {

    public type:number = 0;
    public tts:boolean = false;
    public timeStamp!:string;
    public pinned:boolean = false;
    public mentions:string[] = new Array<string>();
    public id!:string;
    public content!:string;
    public channel!:Channel;
    public author!:Author;
    public attachment!:Attachment;
    public guild!:Guild;
    public member!:Member;

    constructor(data:any){
        this.type = data.type;
        this.tts = data.tts;
        this.timeStamp = data.timestamp;
        this.pinned = data.pinned;
        data.mentions?.forEach((e:any) => {
            this.mentions.push(e.id);
        });
        this.id = data.id;
        this.content = data.content;
        this.author = new Author(data.author);
        this.member = new Member(data.member);
        this.guild = new Guild(data);
        this.channel = new Channel(data);
        this.attachment = new Attachment(data.attachments);

    }




}