var MusicPlayer = require("../../../commands/music/MusicPlayer")
const botDefaultTextChannelID = "730644386727198770";

module.exports = {
    names: ['pause', 'pause music', 'pause the music', 'pause the song', 'pause song', 'pause queue', 'pause track', 'pause the queue', 'pause the track'],
    async execute(params) {
        MusicPlayer.pause();
        const channel = params.client.channels.cache.get(botDefaultTextChannelID);
        await channel.send(`Music paused!`);
    },
};