import * as map from "./map";

const { joinVoiceChannel, AudioPlayerStatus, entersState } = require('@discordjs/voice')

const queue = map.map;

module.exports = {
    name: "skip",
    aliases: ["s", "skip"],
    cooldown: 0,
    description: "skips the current song",
    async execute(message: typeof Client) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send("get in vc");
        const permission = voice_channel.permissionsFor(message.client.user);
        if (!permission.has("SPEAK")) return message.channel.send("you don't have the correct permissions");
        if (!permission.has("CONNECT")) return message.channel.send("you don't have the correct permissions");

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
