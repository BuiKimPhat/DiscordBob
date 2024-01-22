var MusicPlayer = require("../../../commands/music/MusicPlayer")
const botDefaultTextChannelID = "730644386727198770";

module.exports = {
    names: ['stop', 'stop music', 'stop the music', 'stop the song', 'stop song', 'stop queue', 'stop track', 'stop the queue', 'stop the track'],
    async execute(params) {
        MusicPlayer.stop();
        const channel = params.client.channels.cache.get(botDefaultTextChannelID);
        await channel.send(`Music stopped!`);
    },
};