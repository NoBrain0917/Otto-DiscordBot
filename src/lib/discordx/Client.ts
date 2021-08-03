import WebSocket from 'ws';
import { Event } from './Event';
import { Message } from './Message';

export class Client {
    public ws!:WebSocket;
    private action:Map<string,Function> = new Map<string,Function>();
    public static cache:Map<string,any> = new Map<string,any>();

    public on(event:Event, func:Function):void {
        this.action.set(Event[event], func);
    }

    public setActivity(activity:any){

        this.ws.send(JSON.stringify(
            {
                "op": 3,
                "d": {
                    "status": "online",
                    "since": 0,
                    "activities": [
                        activity
                    ],
                    "afk": false
                }
            }
        ));

    }
    
    public login(token:string, isBot:boolean) {
        token = (isBot? `Bot ${token}`:token);
        Client.cache.set("current_token",token);

        this.ws = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");

        this.ws.on("message",message=>{
            var data:any = JSON.parse(message.toString());

            if (data.t == null && data.op == 10) {
                var hb:number = data.d.heartbeat_interval;
                setInterval(() => {
                    this.ws.send(JSON.stringify({"op": 1, "d": 251}))
                }, hb * Math.random())
            }

            if (data.t != null) {
                var type:string = data.t.toUpperCase();

                if(type==Event[Event.READY]){
                    
                }

                this.action.get(type)?.call(this, type==Event[Event.MESSAGE_CREATE]? new Message(data.d):data.d);
            }

        });

        this.ws.on("open",()=>{
            this.ws.send(JSON.stringify({
                "op": 2,
                "d": {
                  "token": token,
                  "intents": 513,
                  "properties": {
                    "os": "Windows",
                    "browser": "Chrome",
                    "device": ""
                  },
                  "presence": {
                    "status": "online",
                    "since": 0,
                    "activities": [],
                    "afk": false
                },
                }
            }));

            
            
        });

        
    }

}