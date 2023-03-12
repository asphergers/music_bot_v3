import { inspect } from "util";
import * as map from "./map";
import { Misc } from "./bot_factory";

const queue = map.map;

module.exports = {
    name: "now playing",
    aliases: ["nowplaying", "np"],
    cooldown: 0,
    description: "shows current song",
    async execute(message: typeof Client) {
        const perms: Array<string> = ["SPEAK", "CONNECT"];

        if(!Misc.has_perms(message, perms)) {
            message.channel.send("you do not have proper perms");
            return;
        }

        const server_queue = queue.get(message.guild.id);

        if (!server_queue || !server_queue.songs) {
            return message.channel.send("nothing is in queue");
        } else {
            return message.channel.send(`now playing **${inspect(server_queue.songs[0].title)}**\nDuration: ${server_queue.songs[0].length}`);
        }
    }
}
