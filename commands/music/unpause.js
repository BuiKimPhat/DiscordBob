const { SlashCommandBuilder } = require('discord.js');
var MusicPlayer = require("./MusicPlayer")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unpause')
		.setDescription('Unpause the music'),
	async execute(interaction) {
        MusicPlayer.pause();
		await interaction.reply('Music unpaused!');
	},
};