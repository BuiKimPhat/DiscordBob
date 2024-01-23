var MusicPlayer = require("../../../commands/music/MusicPlayer")
const Bob = require("../../voice")
const botDefaultTextChannelID = process.env.TEXT_CHANNEL_ID;

module.exports = {
    names: ['reset bot'],
    async execute(params) {
        Bob.instance.init();
        const channel = params.client.channels.cache.get(botDefaultTextChannelID);
        await channel.send(`Bob reset!`);
    },
};