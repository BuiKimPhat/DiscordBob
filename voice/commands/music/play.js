var MusicPlayer = require("../../../commands/music/MusicPlayer")
const botDefaultTextChannelID = process.env.TEXT_CHANNEL_ID;

module.exports = {
    names: ['play','play music', 'play the music', 'play song', 'play the song', 'play track', 'play the track', "phát nhạc"],
    async execute(params) {
        // MusicPlayer.init();
        // params.connection.subscribe(MusicPlayer.player);
        console.log(params.input);
        const query0 = params.input.replace(params.commandName, "");
        const query1 = query0.replace(",", "");
        const query = query1.replace(".", "").trim();
        console.log(query);
        if (query) {
            // await Bob.instance.speak("Playing music!");
            const embedReply = await MusicPlayer.play(query, params.username);
            const channel = params.client.channels.cache.get(botDefaultTextChannelID);
            await channel.send({ embeds: [embedReply] });   
        } else {
            await MusicPlayer.huh();
            const channel = params.client.channels.cache.get(botDefaultTextChannelID);
            await channel.send(`Please say a song's name`);    
        }
    },
};