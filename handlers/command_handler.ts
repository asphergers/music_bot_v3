import * as fs from "fs";


module.exports = (client: typeof Client) => {
        console.log("initalizing commands");
        const command_files = fs.readdirSync('./commands/').filter((file: string) => file.endsWith('ts'));

        for (const file of command_files) {
            const command = require(`../commands/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
            } else {
                continue; 
            }
        }
}
