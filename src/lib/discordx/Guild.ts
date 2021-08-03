export class Guild {
    public id!:string;

    constructor(data:any) {
        this.id = data.guild_id;
    }
}