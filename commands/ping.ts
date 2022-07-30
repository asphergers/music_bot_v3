module.exports = {
    name: "ping",
    description: "basic ping command",
    async execute(message: typeof Client) {
        console.log("ping");
        message.channel.send("pong");
    }
}
