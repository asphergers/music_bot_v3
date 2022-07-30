import * as fs from "fs";

module.exports = (client: typeof Client, discord: typeof Discord) => {
    console.log("initalizing events");
    const load_dir = (dir: string) => {
        const event_files = fs.readdirSync(`./events/${dir}`).filter((file: string) => file.endsWith('.ts'));

        for (const file of event_files) {
            const event = require(`../events/${dir}/${file}`);
            const event_name = file.split('.')[0];
            client.on(event_name, event.bind(null, discord, client));
        }
    }

    ['client', 'guild'].forEach(e =>load_dir(e));
}
