import * as map from "./map";

const queue = map.map;

module.exports = {
    name: "upcoming",
    aliases: ["upcoming", "queue", "q"],
    coodown: 0,
    description: "displays all songs in queue",
    async execute(message: typeof Client) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send("get in vc");
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) return message.channel.send("you do not have the right perms");
        if (!permissions.has("SPEAK")) return message.channel.send("you do not have the correct perms");

        var list: string[] = [];

        const server_queue = queue.get(message.guild.id);


        if (!!server_queue) {
            for (var i = 0; i < server_queue.songs.length; i++) {
                list.push(`${server_queue.songs[i].title}`);
            }
        } else {
            return message.channel.send("nothing is in queue");
        }

        var output: string = "";

        for (var i = 0; i < list.length; i++) {
            output += `${list[i]}\n`;
        }

        message.channel.send(output);
    }
}
