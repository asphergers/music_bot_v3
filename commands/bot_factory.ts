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

export class Bot_Instance {
    message: typeof Client;
    guild_id: string;
    connection;
    resource: any;
    stream: typeof play;
    player = createAudioPlayer({
    behaviors: {
            noSubscriber: NoSubscriberBehavior.Play
        }
    })

    constructor(message: typeof Client) {
        this.guild_id = message.guild.id;
        this.connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
        this.message = message;
        this.connection.subscribe(this.player);
    }

    async set_stream(song: Song, seconds?: number) {
        if (seconds === undefined) seconds = 0;

        if (!queue.get(this.guild_id).songs[0]) {
            this.connection.destroy();
            queue.delete(this.guild_id);
            console.log("connection destroyed");
            this.message.channel.send("no songs left in queue, connection destroyed");
            return;
        }

        this.stream = await play.stream(song.url, {seek: seconds});
        this.resource = createAudioResource(this.stream.stream, {inputType: this.stream.type});
    }

    async play_song() {
        this.player.play(this.resource);

        this.player.on(AudioPlayerStatus.Idle, async () => {
            if (queue.get(this.guild_id).loop) {
                await this.set_stream(queue.get(this.guild_id).songs[0]);
                this.player.play(this.resource);
            } else {
                try {
                    queue.get(this.guild_id).songs.shift();
                    await this.set_stream(queue.get(this.guild_id).songs[0]);
                    this.player.play(this.resource);
                    this.message.channel.send(`now playing ${queue.get(this.guild_id).songs[0].title}`);
                } catch {
                    console.log("error unable to play next song");
                    this.message.channel.send("unable to play next track");
                }
            }
        });
    }
}

