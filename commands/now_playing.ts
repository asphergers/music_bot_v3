import { inspect } from "util";
import * as map from "./map";

const queue = map.map;

module.exports = {
    name: "now playing",
    aliases: ["nowplaying", "np"],
    cooldown: 0,
    description: "shows current song",
    async execute(message: typeof Client) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send("get in vc");
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send("you do not have the correct perms");
        if (!permissions.has('SPEAK')) return message.channel.send("you do not have the correct perms");

        const server_queue = queue.get(message.guild.id);

        if (!server_queue || !server_queue.songs) {
            return message.channel.send("nothing is in queue");
        } else {
            return message.channel.send(`now playing **${inspect(server_queue.songs[0].title)}**\nDuration: ${server_queue.songs[0].length}`);
        }
    }
}
