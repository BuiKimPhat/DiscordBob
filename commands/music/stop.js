const { SlashCommandBuilder } = require('discord.js');
var MusicPlayer = require("./MusicPlayer")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop the music'),
	async execute(interaction) {
        MusicPlayer.stop();
		await interaction.reply('Music stopped!');
	},
};