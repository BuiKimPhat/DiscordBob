const Bob = require("../../voice")
const botDefaultTextChannelID = process.env.TEXT_CHANNEL_ID;

module.exports = {
    names: ['reset bot'],
    async execute(params) {
        Bob.instance.init();
        Bob.instance.speak("Bob has been reset!");
        const channel = params.client.channels.cache.get(botDefaultTextChannelID);
        await channel.send(`Bob reset!`);
    },
};