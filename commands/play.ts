const play = require("play-dl");
const yt_search = require("yt-search")
const { joinVoiceChannel } = require('@discordjs/voice')
import * as map from "./map";
import { Song, Bot_Instance, Misc } from "./bot_factory";

console.log(map);

const queue = map.map;

module.exports = {
    name: 'play',
    aliases: ["play", "p"],
    cooldown: 0,
    description: 'main command for playing music',
    async execute(message: typeof Client, args: string[]) {

        const perms: Array<string> = ["SPEAK", "CONNECT"];

        if(!Misc.has_perms(message, perms)) {
            message.channel.send("you do not have proper perms");
            return;
        }

        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send("get in vc clowboy");

        const server_queue = queue.get(message.guild.id);

        if (args[0].startsWith("http") && play.validate(args[0]) === "yt_video") {
            var song_info = await play.video_basic_info(args[0]);
            var song: Song = {
                title: song_info.video_details.title,
                url: song_info.video_details.url,
                length: song_info.video_details.durationInSec,
                type: "youtube",
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
                    type: "youtube",
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
                songs: [],
                loop: false,
                bot: new Bot_Instance(message),
            }

            queue_constructor.songs.push(song);
            queue.set(message.guild.id, queue_constructor);

            try {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator
                });
                queue_constructor.connection = connection;
                await queue_constructor.bot.set_stream(queue_constructor.songs[0]);
                await queue_constructor.bot.play_song();
                message.channel.send(`now playing ${queue.get(message.guild.id).songs[0].title}`);
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

