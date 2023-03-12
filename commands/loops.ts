import * as map from "./map";
import { Misc } from "./bot_factory";

const queue = map.map;

module.exports = {
    name: "loop",
    aliases: ["loop"],
    coolodwn: 0,
    description: "loops the current track",
    async execute(message: typeof Client) {
        const perms: Array<string> = ["SPEAK", "CONNECT"];

        if(!Misc.has_perms(message, perms)) {
            message.channel.send("you do not have proper perms");
            return;
        }

        if (!queue.get(message.guild.id)) return message.channel.send("server has to active queue");
    
        queue.get(message.guild.id).loop = !queue.get(message.guild.id).loop;

        message.channel.send(`Loop: ${queue.get(message.guild.id).loop}`);
    }
}
