import axios from "axios";
import { Activity } from "./lib/discordx/Activity";
import { Client } from "./lib/discordx/Client";
import { Event } from "./lib/discordx/Event";
import { Message } from "./lib/discordx/Message";
import { Utils } from "./utils/Utils";

var client:Client = new Client();

client.on(Event.READY,()=>{
  console.log("start");

  client.setActivity({
    name: "A Dance of Fire and Ice",
    type: Activity.STREAM,
    state: "linear ring - Can you hear me?",
    details: "Orbiting",
    url:"https://www.twitch.tv/test"
  });

});

client.on(Event.MESSAGE_CREATE, async (message:Message)=>{

  if(message.author.bot) return;

  var isUMMText:boolean = message.content.startsWith("Mono path[0] = ");
  if(message.attachment.isFile) {
    var isText:boolean = message.attachment.filename.toLowerCase().endsWith(".txt");

    if(!isText) return;
    var file:string = (await axios.get(message.attachment.url)).data;
    var isUMM:boolean = file.startsWith("Mono path[0] = ");

    if(!isUMM) return;
    Utils.checkLog(message,file);
    
  } else if(isUMMText){
    Utils.checkLog(message,message.content);
  }

});

client.login("ODcwODk2MzY4Nzk1OTE0MjQw.YQTbcg.38j8IA7BDhRWgeMB3at1VIDPEjI", true);