const { createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require("@discordjs/voice");
const ytdl = require('ytdl-core');
const youtube = require("@googleapis/youtube").youtube("v3");
const { EmbedBuilder } = require('discord.js');
const jsdom = require("jsdom");

const htmlDecode = (input) => {
    const jsd = new jsdom.JSDOM();
    const parser = new jsd.window.DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    console.log(doc.documentElement.textContent)
    return doc.documentElement.textContent;
}

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
            // console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
            if (newState.status == 'idle') this.stop();
        });
    },
    play: async function(query, username) {
        let url = "";
        let title = "Not found";
        let embedReply = new EmbedBuilder().setColor(0x0099FF);
        if (!isValidUrl(query)){
            const res = await youtube.search.list({part: "snippet", order: "relevance", type: "video", q: query, auth: process.env.YOUTUBE_TOKEN});
            if (res.data.items && res.data.items.length > 0){
                url = `https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`;
                title = res.data.items[0].snippet.title;
                embedReply.setAuthor({ name: res.data.items[0].snippet.channelTitle, iconURL: 'https://www.youtube.com/s/desktop/d84e1538/img/favicon_96x96.png' })
                    .setDescription(res.data.items[0].snippet.description)
                    .setImage(res.data.items[0].snippet.thumbnails.medium.url)
            } else {
                this.huh();
            }
        } else {
            url = query;
            title = url; 
        }
        embedReply.setTitle(htmlDecode(title)).setURL(url).setTimestamp()
            .setFooter({ text: `Called by ${username}` });;

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