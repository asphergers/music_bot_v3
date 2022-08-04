import * as map from "./map";

const queue = map.map;

module.exports = {
    name: "loop",
    aliases: ["loop"],
    coolodwn: 0,
    description: "loops the current track",
    async execute(message: typeof Client) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channl.send("get in vc");
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) return message.channel.send("you don't have the correct perms");
        if (!queue.get(message.guild.id)) return message.channel.send("server has to active queue");
    
        queue.get(message.guild.id).loop = !queue.get(message.guild.id).loop;

        message.channel.send(`Loop: ${queue.get(message.guild.id).loop}`);
    }
}
