import axios from "axios";
import { Client } from "./Client";
import { MessageEmbed } from "./MessageEmbed";

export class Channel {
    public id!:string;

    constructor(data:any) {
        this.id = data.channel_id;
    }

    public async send(str:any):Promise<void> {
        try {

            
            var isEmbed:boolean = str instanceof MessageEmbed;
        await axios.options(`https://discord.com/api/v9/channels/${this.id}/messages`,{
            headers:{
                "Access-Control-Request-Headers": "authorization,content-type,x-fingerprint,x-super-properties",
                "Access-Control-Request-Method": "POST"
            }
        })
        await axios({
            url:"https://discord.com/api/v9/channels/753594580330348558/messages",
            method:"POST",
            headers:{
              "Authorization": Client.cache.get("current_token"),
              "Content-Type": "application/json"
            },
            data:{
                "content":`${isEmbed? "":str}`,
                "tts":false,
                "embeds":isEmbed? [str]:[],
            }
        });
    } catch (e){
    }
    }

}