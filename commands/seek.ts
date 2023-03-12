import * as map from "./map";
import { Misc } from "./bot_factory";

const queue = map.map;


module.exports = {
    name: "seek",
    aliases: ["seek"],
    cooldown: 0,
    description: "skip a point in a track",
    async execute(message: typeof Client, args: string[]) {
        const perms: Array<string> = ["SPEAK", "CONNECT"];

        if(!Misc.has_perms(message, perms)) {
            message.channel.send("you do not have proper perms");
            return;
        }

        const server_queue = queue.get(message.guild.id);

        const time = parseInt(args[0]);

        if (Number.isInteger(time) && !!server_queue && !!server_queue.songs) {
            const track_len = Number(String(server_queue.songs[0].length).split(" ")[0]);
            if (time > track_len-1 || time < 0) return message.channel.send("seek time is not in range");
            await server_queue.bot.set_stream(server_queue.songs[0], time);
            await server_queue.bot.play_song();
        } else {
            return message.channel.send("seek time is not an integer or there is no server queue");
        }

    }
}
