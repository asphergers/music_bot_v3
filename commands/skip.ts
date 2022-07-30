import { video_player } from "./bot_factory";
const map = require("./map");

const { joinVoiceChannel } = require('@discordjs/voice')

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

        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        try {
            queue.get(message.guild.id).songs.shift();
            video_player(message.guild, song_queue.songs[0], message);
        } catch (e) {
            connection.destroy();
            message.channel.send("something went awfully wrong");
            queue.delete(message.guild.id);
            console.log(e);
            return;
        }

    }
}
