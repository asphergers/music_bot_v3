const play = require("play-dl");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice')
import * as map from "./map";

const queue = map.map;

export interface Song {
    title: string;
    url: any;
    length: number;
    type: string;
}

export const video_player = async (guild: typeof Client, song: Song, message: typeof Client, seconds?: number) => {
    if (seconds === undefined) seconds = 0;

    const connection = joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    });

    const song_queue = queue.get(guild.id);

    if (!song) {
        connection.destroy();
        queue.delete(guild.id);
        console.log("connection destroyed");
        return;
    }

    const stream = await play.stream(song.url, {seek: seconds});
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    });

    const resource = createAudioResource(stream.stream, {inputType: stream.type});
    player.play(resource);
    connection.subscribe(player);
    player.on("error", (error: string) => {
        console.log("error occured during playtime");
        console.log(error);
    });

    player.on(AudioPlayerStatus.Idle, () => {
        if (queue.get(guild.id).loop) { // this will be used to implement a loop feature later
            video_player(guild, song_queue.songs[0], message);
        } else {
            try {
                song_queue.songs.shift();
                video_player(guild, song_queue.songs[0], message);
            } catch {
                console.log("error");
                message.channel.send("unable to play next track");
            } 
        }
    });

    await song_queue.text_channel.send(`Now playing ${song.title}`);
}

