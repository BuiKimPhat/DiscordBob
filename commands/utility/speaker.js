const { SlashCommandBuilder } = require('discord.js');
const Bob = require("../../voice/voice")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setspeaker')
		.setDescription('Set Bob\'s voice.')
        .addStringOption(option =>
            option.setName('speakeridx')
                .setDescription('SpeakerIDX: p225 -> p376')
                .setRequired(true)),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
        const speaker = interaction.options.getString("speakeridx");
        Bob.instance.setSpeakerIdx(speaker);
		await interaction.reply(`Bob's speaker has been set to ${speaker}`);
	},
};