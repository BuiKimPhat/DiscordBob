const { bold, SlashCommandBuilder } = require('discord.js');
const { spawn } = require("child_process");
var fs = require('fs');

const gpt = async (prompt, interaction) => {
    const gptProcess = spawn("python3", [
        "./python/gpt.py", `"${prompt}"`,
    ]);
    gptProcess.on('close', (code) => {
        if (code === 0) {
            const data = JSON.parse(fs.readFileSync(`./python/gpt_result.json`));
            const result = data.output;
            const startResponse = result.indexOf("\n");
            if (startResponse != -1 && (startResponse + 1) < result.length) {
                gptProcess.kill();
                const response = result.substring(startResponse + 1);
                const request = prompt + result.substring(0, startResponse);
                const output = bold(`${interaction.user.displayName}: \n`) + request + "\n" + bold("Bob: \n") + response + "\n\n";
                interaction.editReply(output);
            } else {
                gptProcess.kill();
                const response = result;
                const request = prompt;
                const output = bold(`${interaction.user.displayName}: \n`) + request + "\n" + bold("Bob: \n") + response + "\n\n";
                interaction.editReply(output);
            }
        } else {
            gptProcess.kill();
            console.error(`GPT exec error. Exit code: ${code}`);
            interaction.editReply("Bob is so sick that he can't answer you right now :(");
        }
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('Ask Bob something weird.')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Anything you wanna say')
                .setRequired(true)),
    async execute(interaction) {
        // interaction.guild is the object representing the Guild in which the command was run
        const prompt = interaction.options.getString("prompt");
        await interaction.deferReply();
        await gpt(prompt, interaction);
    },
};