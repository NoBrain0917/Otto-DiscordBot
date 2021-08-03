import axios from "axios";
import { Client } from "./Client";

export class Author{

    public username!:string;
    public id!:string;
    public tag!:string;
    public avatarURL!:string;
    public avatar!:string;
    public bot:boolean = false;

    constructor(data:any) {
        this.username = data.username;
        this.id = data.id;
        this.tag = data.discriminator;
        this.avatar = data.avatar;
        this.bot = data.bot;
        this.avatarURL = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
    }


}