const { createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require("@discordjs/voice");
const ytdl = require('ytdl-core');
const youtube = require("@googleapis/youtube").youtube("v3");

const isValidUrl = query => {
    try { 
        return Boolean(new URL(query)); 
    }
    catch(e){ 
        return false; 
    }
}

var MusicPlayer = {
    player: null,
    volume: 0.9,
    init: function() {
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        this.player.on('error', error => {
            console.error('Error:', error);
        });
        this.player.on('stateChange', (oldState, newState) => {
            console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
            if (newState.status == 'idle') this.stop();
        });
    },
    play: async function(query) {
        let url = "";
        let title = "Not found";
        if (!isValidUrl(query)){
            const res = await youtube.search.list({part: "snippet", order: "relevance", type: "video", q: query, auth: process.env.YOUTUBE_TOKEN});
            if (res.data.items && res.data.items.length > 0){
                url = `https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`;
                title = res.data.items[0].snippet.title;    
            } else {
                this.huh();
            }
        } else {
            url = query;
            title = url;
        }
        const stream = ytdl(url, { filter: 'audioonly' });
        let resource = createAudioResource(stream, { inlineVolume: true });
        resource.volume.setVolume(this.volume);
        this.player.play(resource);        
        return title;
    }
    ,
    stop: function() {
        this.player.stop();
    },
    pause: function() {
        this.player.pause();
    },
    unpause: function() {
        this.player.unpause();
    },
    huh: function(){
        const resource = createAudioResource("/root/DiscordBob/audio/huh.mp3");
        this.player.play(resource);
    },
    speak: function(){
        const resource = createAudioResource("/root/DiscordBob/voice/bob.mp3");
        this.player.play(resource);
    }
}

module.exports = MusicPlayer;