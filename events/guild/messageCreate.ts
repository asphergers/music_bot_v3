import * as config from "../../config.json";
const prefix = config.prefix;

module.exports = (Discord: null, client: typeof Client, message: typeof Client) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);

    const cmd = args.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find((a: typeof Client) => a.aliases && a.aliases.includes(cmd));

    if (command) {
        command.execute(message, args, cmd, client, Discord);
    }
}
