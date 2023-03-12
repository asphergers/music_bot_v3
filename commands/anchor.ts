import { Misc } from "./bot_factory";

const map = require('./map');

const queue = map.map;

module.exports = {
    name: "anchor81",
    cooldown: 0,
    description: "anchor the bot's output to a channel",
    async execute(message: typeof Client) {

        const perms: Array<string> = ["SPEAK"];

        if(!Misc.has_perms(message, perms)) {
            message.channel.send("you do not have proper perms");
            return;
        }

        const server_instance = queue.get(message.guild.id);

        try {
            server_instance.bot.message = message;
            message.channel.send("anchored to this channel");
        } catch (e) {
            message.channel.send("something went wrong");
            console.log(e);
        }
        return;
    }
}
