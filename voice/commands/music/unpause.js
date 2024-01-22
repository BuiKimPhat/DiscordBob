var MusicPlayer = require("../../../commands/music/MusicPlayer")
const botDefaultTextChannelID = "730644386727198770";

module.exports = {
    names: ['unpause','unpause music', 'unpause the music', 'unpause the song', 'unpause song', 'unpause queue', 'unpause track', 'unpause the queue', 'unpause the track'],
    async execute(params) {
        MusicPlayer.unpause();
        const channel = params.client.channels.cache.get(botDefaultTextChannelID);
        await channel.send(`Music unpaused!`);
    },
};