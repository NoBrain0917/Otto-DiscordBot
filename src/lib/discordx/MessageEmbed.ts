import { Utils } from "../../utils/Utils";

export class MessageEmbed {
    private title:string|null = null;
    private type:string = "rich";
    private description:string|null = null;
    private url:string|null = null;
    private color:any = null;
    private fields:any[] = new Array<any>();
    private thumbnail:any = null;
    private image:any = null;
    private author:any = null;
    private footer:any = null;
    private timestamp:Date|null = null;

    
    public setColor(str:string):void{
        this.color = Utils.resolveColor(str);
    }
    public setTimestamp():void {
        this.timestamp = new Date();
    }
    public setThumbnail(str:string):void {
        this.thumbnail = {"url":str};
    }
    public setTitle(str:string):void {
        this.title = str;
    }
    public addField(name:string, value:string){
        this.fields.push({
            name: name,
			value: value,
			inline: false,
        })
    }
    public setURL(str:string):void {
        this.url = str;
    }
    public setDescription(str:string):void {
        this.description = str;
    }
    public setAuthor(name:string, icon:string, url:string):void {
        this.author = {"name":name,"icon_url":icon,"url":url};
    }
    public setFooter(text:string, icon:string){
        this.footer = {"text":text,"icon_url":icon};
    }
    public setImage(str:string):void {
        this.image = {url:str};
    }
}
