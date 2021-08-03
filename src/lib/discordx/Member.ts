export class Member {
    public roles:string[] = new Array<string>();
    public nick!:string;
    public mute:boolean = false;
    public joined_at!:string;

    constructor(data:any){
        this.roles = data.roles;
        this.nick = data.nick;
        this.mute = data.mute;
        this.joined_at = data.joined_at;
    }
}