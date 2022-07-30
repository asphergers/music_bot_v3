const play = require("play-dl");
const yt_search = require("yt-search")
const { createAudioPlayer, createAudioResource , StreamType, demuxProbe, joinVoiceChannel, NoSubscriberBehavior, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require('@discordjs/voice')
import * as map from "./map";

console.log(map);

const queue = map.map;

interface Song {
    title: string;
    url: any;
    length: number;
    type: string;
}


module.exports = {
    name: 'play',
    cooldown: 0,
    description: 'main command for playing music',
    async execute(message: typeof Client, args: string[], cmd: string) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send("get in vc clownboy");
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send("no perms :(");
        if (!permissions.has('SPEAK')) return message.channel.send("no perms :(");

        const server_queue = queue.get(message.guild.id);


        if (args[0].startsWith("http") && play.validate(args[0]) === "yt_video") {
            var song_info = await play.video_basic_info(args[0]);
            var song: Song = {
                title: song_info.video_details.title,
                url: song_info.video_details.url,
                length: song_info.video_details.durationInSec,
                type: "youtube"
            }
        } else {
            const video_finder = async(query: string) => {
                const video_result = await yt_search(query);
                return (video_result.videos.length > 1) ? video_result.videos[0] : null;
            }

            const video = await video_finder(args.join(' '));
            
            if (video) {
                var song: Song = {
                    title: video.title,
                    url: video.url,
                    length: video.duration,
                    type: "youtube"
                }
            } else {
                message.channel.send("no results found from youtube");
                return;
            }
        }

        if (!server_queue) {
            const queue_constructor: any = {
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs: []
            }

            queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song);

            try {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator
                });
                queue_constructor.connection = connection;
                video_player(message.guild, queue_constructor.songs[0], message);
            } catch (err) {
                queue.delete(message.guild.id);
                message.channel.send("unable to join vc");
                console.log(err);
                return;
            }
        } else {
            server_queue.songs.push(song);
            return message.channel.send(`${song.title} added to queue`);
        }
    }
}

const video_player = async (guild: typeof Client, song: Song, message: typeof Client) => {
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

    const stream = await play.stream(song.url);
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
        if (1 < 0) { // this will be used to implement a loop feature later
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
