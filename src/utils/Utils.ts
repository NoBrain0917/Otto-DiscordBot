
import { ErrorType } from "../enum/ErrorType";
import { Message } from "../lib/discordx/Message";
import { MessageEmbed } from "../lib/discordx/MessageEmbed";

declare global {
    interface String {
      getValue(s1:string, s2:string): string;
    }
  }
  
  String.prototype.getValue = function(s1:string, s2:string):string {
    var one:string|null = this.split(s1)[1];
    if(one==null) return "";
    var two:string|null = one.split(s2)[0];
    return two==null? "":two.trim();
  };


export class Utils {
    public static ModSolution:Map<string,string> = new Map<string,string>();

    private static Colors:any = {
        DEFAULT: 0x000000,
        WHITE: 0xffffff,
        AQUA: 0x1abc9c,
        GREEN: 0x57f287,
        BLUE: 0x3498db,
        YELLOW: 0xfee75c,
        PURPLE: 0x9b59b6,
        LUMINOUS_VIVID_PINK: 0xe91e63,
        FUCHSIA: 0xeb459e,
        GOLD: 0xf1c40f,
        ORANGE: 0xe67e22,
        RED: 0xed4245,
        GREY: 0x95a5a6,
        NAVY: 0x34495e,
        DARK_AQUA: 0x11806a,
        DARK_GREEN: 0x1f8b4c,
        DARK_BLUE: 0x206694,
        DARK_PURPLE: 0x71368a,
        DARK_VIVID_PINK: 0xad1457,
        DARK_GOLD: 0xc27c0e,
        DARK_ORANGE: 0xa84300,
        DARK_RED: 0x992d22,
        DARK_GREY: 0x979c9f,
        DARKER_GREY: 0x7f8c8d,
        LIGHT_GREY: 0xbcc0c0,
        DARK_NAVY: 0x2c3e50,
        BLURPLE: 0x5865f2,
        GREYPLE: 0x99aab5,
        DARK_BUT_NOT_BLACK: 0x2c2f33,
        NOT_QUITE_BLACK: 0x23272a,
    };



    public static resolveColor(color:any):any {
            if (typeof color === 'string') {
              if (color === 'RANDOM') return Math.floor(Math.random() * (0xffffff + 1));
              if (color === 'DEFAULT') return 0;
              color = Utils.Colors[color] ?? parseInt(color.replace('#', ''), 16);
            } else if (Array.isArray(color)) {
              color = (color[0] << 16) + (color[1] << 8) + color[2];
            }
            return color;
        }

    public static toErrorType(str:string):ErrorType {
        if(str.includes("Method 'SetupLevelEventsInfo' not found.")) return ErrorType.LATEST_VER;
        if(str.includes("Class 'ADOStartup' not found.")) return ErrorType.OLD_VER;
        if(str.includes("ExecutionEngineException: String conversion error: Illegal byte sequence encounted in the input.")) return ErrorType.PATH_KOREAN;
        if(str.includes("[Exception]")) return ErrorType.MOD;
        return ErrorType.IDK;
    }
    
    public static DefaultEmbed(adofaiVersion:string, ummVersion:string, modList:string[]):MessageEmbed {
        var embed:MessageEmbed = new MessageEmbed();
        embed.setTitle("Otto가 로그를 확인했어요!")
        embed.setDescription(`얼불춤 버전 - ${adofaiVersion==null? "???":"r"+adofaiVersion}, UMM 버전 - ${ummVersion==null? "???":ummVersion}${modList[0]==null? "":"\n활성화 된 모드 - "+modList.join(", ")}`);
        return embed;
    }

    public static checkLog(message:Message,file:string):void {
        var gameName:string = "", adofaiVersion:string = "", ummVersion:string = "", modList:string[] = new Array<string>(), errorMod:any = {};
    
            file.split("\n").forEach((v:string)=>{
                if(v.startsWith("[Manager] Game:")) gameName = v.getValue("[Manager] Game:",".");
                if(v.startsWith("Version r")) adofaiVersion = v.getValue("Version r",",");
                if(v.startsWith("[Manager] Version:")) ummVersion = v.getValue("[Manager] Version:",",");
                var name:string = v.getValue("[","]");
                if(!v.startsWith("[Manager]")&&v.startsWith("[")&&v.includes("]")&&v.includes("Active.")&&!modList.includes(name)) modList.push(name);
                if(!v.startsWith("[Manager]")&&v.startsWith("[")&&v.includes("]")&&v.includes("[Exception]")&&!Object.keys(errorMod).includes(name)) {
                    if(errorMod[name]==null) errorMod[name] = [];
                    errorMod[name].push(v.split("[Exception]")[1].trim());
                }
            });
    
        
            if(gameName!="A Dance of Fire and Ice") {
                var embed:MessageEmbed = new MessageEmbed();
                embed.setDescription("흠... 제가 보기엔 이건 얼불춤이 아닌 것 같은데요");
    
                message.channel.send(embed);
                return;
            }
    
            ummVersion = ummVersion.substr(0,ummVersion.length-1);
    
            switch(Utils.toErrorType(file)) {
                case ErrorType.LATEST_VER:
                    var embed:MessageEmbed = Utils.DefaultEmbed(adofaiVersion,ummVersion,modList);
                    embed.addField("잘못된 XML 세팅","1. `UnityModManager.xml` 파일을 열기\n2. `<GameInfo Name=\"A Dance of Fire and Ice\">` 라인으로 가서\n"+
                    "```xml\n<StartingPoint>[Assembly-CSharp.dll]ADOBase.SetupLevelEventsInfo:Before</StartingPoint>\n<UIStartingPoint>[Assembly-CSharp.dll]ADOBase.SetupLevelEventsInfo:After</UIStartingPoint>```"+
                    "위 내용을 ```xml\n<StartingPoint>[Assembly-CSharp.dll]ADOStartup.Startup:Before</StartingPoint>\n<UIStartingPoint>[Assembly-CSharp.dll]ADOStartup.Startup:After</UIStartingPoint>```이렇게 변경해주세요.");
                    message.channel.send(`<@!${message.author.id}>`)
                    message.channel.send(embed);
                    break;
                
                case ErrorType.OLD_VER:
                    var embed:MessageEmbed = Utils.DefaultEmbed(adofaiVersion,ummVersion,modList);
                    embed.addField("업데이트 필요",adofaiVersion=="68"? "할로윈은 이제 놔주실 때가 되었습니다, 최신 버전의 얼불춤이 더 안정성 있고 최적화되어있습니다.":"얼불춤을 최신 버전으로 업데이트 해주세요.");
                    message.channel.send(`<@!${message.author.id}>`)
                    message.channel.send(embed);
                    break;
    
                case ErrorType.PATH_KOREAN:
                    var embed:MessageEmbed = Utils.DefaultEmbed(adofaiVersion,ummVersion,modList);
                    var path:string = file.getValue("Mono path[0] = '","'");
                    var path2:string = "";
                    path.split("/").forEach((v:string)=>{
                        path2+=`${/[ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(v)? "**`"+v+"`**":v}/`
                    });
                    embed.addField("잘못된 경로",`설치되어있는 폴더 경로에 한글이 들어가 있으면 제대로 작동하지 않습니다.\n현재 경로 - ${path2.replace("/A Dance of Fire and Ice_Data/Managed/","")}`);
                    message.channel.send(`<@!${message.author.id}>`)
                    message.channel.send(embed);
                    break;
    
                case ErrorType.MOD:
                    var embed:MessageEmbed = Utils.DefaultEmbed(adofaiVersion,ummVersion,modList);
                    
                    for(var v in errorMod) {
                        errorMod[v] = errorMod[v].filter((element:any, index:any) => {
                            return errorMod[v].indexOf(element) === index;
                        });
                        errorMod[v].forEach((v2:string)=>{
                            embed.addField(`${v} 오류`,"`"+Utils.ModSolution.get(v2)==null? v2:Utils.ModSolution.get(v2)+"`");
                        });
                    }
                    message.channel.send(`<@!${message.author.id}>`)
                    message.channel.send(embed)
                    break;
    
                case ErrorType.IDK:
                    var embed:MessageEmbed = Utils.DefaultEmbed(adofaiVersion,ummVersion,modList);
                    embed.addField("문제가 없습니다","음... 제가 보기론 딱히 문제가 없어보이는데 다른 유저도 그런지 확인해보세요");
                    message.channel.send(`<@!${message.author.id}>`);
                    message.channel.send(embed);
                    break;
            }
    }

}