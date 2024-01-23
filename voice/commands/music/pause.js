var MusicPlayer = require("../../../commands/music/MusicPlayer")
const Bob = require("../../voice");
const botDefaultTextChannelID = process.env.TEXT_CHANNEL_ID;

module.exports = {
    names: ['pause', 'pause music', 'pause the music', 'pause the song', 'pause song', 'pause queue', 'pause track', 'pause the queue', 'pause the track', "tạm dừng"],
    async execute(params) {
        Bob.instance.speak("Music paused!");
        MusicPlayer.pause();
        const channel = params.client.channels.cache.get(botDefaultTextChannelID);
        await channel.send(`Music paused!`);
    },
};