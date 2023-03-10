const map = require('./map');

const queue = map.map;

module.exports = {
    name: "anchor81",
    cooldown: 0,
    description: "anchor the bot's output to a channel",
    async execute(message: typeof Client) {
        const voice_channel = message.member.voice.channel;
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has("SPEAK")) return message.channel.send("you do not have perms");

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
