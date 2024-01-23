var MusicPlayer = require("../../../commands/music/MusicPlayer")
const botDefaultTextChannelID = process.env.TEXT_CHANNEL_ID;

module.exports = {
    names: ['stop', 'stop music', 'stop the music', 'stop the song', 'stop song', 'stop queue', 'stop track', 'stop the queue', 'stop the track', "dừng nhạc"],
    async execute(params) {
        MusicPlayer.stop();
        const channel = params.client.channels.cache.get(botDefaultTextChannelID);
        await channel.send(`Music stopped!`);
    },
};