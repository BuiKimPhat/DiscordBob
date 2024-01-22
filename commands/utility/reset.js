const { SlashCommandBuilder } = require('discord.js');
const Bob = require("../../voice/voice")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resetai')
		.setDescription('Reset Bob\'s AI.'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
        Bob.instance.init();
		await interaction.reply(`Bob has been reset.`);
	},
};