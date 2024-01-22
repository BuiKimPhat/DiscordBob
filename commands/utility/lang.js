const { SlashCommandBuilder } = require('discord.js');
const Bob = require("../../voice/voice")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setlang')
		.setDescription('Set Bob\'s ASR language.')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Language (English,Vietnamese,...)')
                .setRequired(true)
                .addChoices(
                    { name: 'Vietnamese', value: 'Vietnamese' },
                    { name: 'English', value: 'English' },
                )),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
        const lang = interaction.options.getString("language");
        Bob.instance.setLang(lang);
		await interaction.reply(`Bob's recognition language has been set to ${lang}`);
	},
};