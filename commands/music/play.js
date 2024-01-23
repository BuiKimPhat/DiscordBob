const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require("@discordjs/voice");
var MusicPlayer = require("./MusicPlayer")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The youtube URL to be played')
                .setRequired(true)),
    async execute(interaction) {
        // join voice then huh
        const channel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false,
        });
    
        MusicPlayer.init();
        connection.subscribe(MusicPlayer.player);
        const query = interaction.options.getString("query")
        const embedReply = await MusicPlayer.play(query, interaction.user.displayName);
       
        await interaction.reply({ embeds: [embedReply] });
    },
};