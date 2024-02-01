const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require("@discordjs/voice");
const Bob = require("../../voice/voice.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Make AI assistant join voice channel'),
	async execute(interaction) {
        if (interaction.member.voice){
            // init huh audio
            const player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            player.on('error', error => {
                console.error('Error:', error.message, 'with track', error.resource.metadata.title);
            });
            const resource = createAudioResource("/root/DiscordBob/audio/huh.mp3");

            // join voice then huh
            const channel = interaction.member.voice.channel;
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfMute: false,
                selfDeaf: false,
            });  

            player.play(resource);
            connection.subscribe(player);
            // console.log(connection)
            await interaction.reply("Joined the channel")
            
            // create VoiceTranscriptor, listen to voice
            if (!Bob.instance) {
                const bob = new Bob(interaction.client, 0, connection);
            }
        } else {
            await interaction.reply("You haven't connected to a voice channel yet!")
        }
	},
};