const { Client, IntentsBitField } = require("discord.js");
const Discord = require("discord.js");
const config = require("./config.json");

const inents = [IntentsBitField.Guild_Bans];

const client = new Client({ intents: new IntentsBitField(33415) }); 


client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}.ts`)(client, Discord);
})




client.login(config.token);




