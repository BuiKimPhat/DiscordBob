var MusicPlayer = require("../../../commands/music/MusicPlayer")
const botDefaultTextChannelID = process.env.TEXT_CHANNEL_ID;

module.exports = {
    names: ['unpause','unpause music', 'unpause the music', 'unpause the song', 'unpause song', 'unpause queue', 'unpause track', 'unpause the queue', 'unpause the track', "tiếp tục"],
    async execute(params) {
        MusicPlayer.unpause();
        const channel = params.client.channels.cache.get(botDefaultTextChannelID);
        await channel.send(`Music unpaused!`);
    },
};