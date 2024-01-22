const { SlashCommandBuilder } = require('discord.js');
var MusicPlayer = require("./MusicPlayer")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the music'),
	async execute(interaction) {
        MusicPlayer.pause();
		await interaction.reply('Music paused!');
	},
};