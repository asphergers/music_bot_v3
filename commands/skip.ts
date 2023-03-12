import * as map from "./map";
import { Misc } from "./bot_factory";

const queue = map.map;

module.exports = {
    name: "skip",
    aliases: ["s", "skip"],
    cooldown: 0,
    description: "skips the current song",
    async execute(message: typeof Client) {

        const perms: Array<string> = ["SPEAK", "CONNECT"];

        if(!Misc.has_perms(message, perms)) {
            message.channel.send("you do not have proper perms");
            return;
        }

        const song_queue = queue.get(message.guild.id);

        try {
            const prev_loop = song_queue.loop;
            song_queue.loop = false;
            song_queue.bot.player.stop();
            song_queue.loop = prev_loop;
        } catch (e) {
            song_queue.bot.connection.destroy();
            message.channel.send("something went awfully wrong");
            queue.delete(message.guild.id);
            console.log(e);
            return;
        }
    }
}
