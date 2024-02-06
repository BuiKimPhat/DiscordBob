const Bob = require("../../voice")
const botDefaultTextChannelID = process.env.TEXT_CHANNEL_ID;

module.exports = {
    names: ['switch language', 'đổi ngôn ngữ'],
    async execute(params) {
        let targetLang = "Vietnamese";
        if (Bob.instance.getLang() == "English") {
            targetLang = "Vietnamese";
            Bob.instance.setLang(targetLang);
        } else {
            targetLang = "English";
            Bob.instance.setLang(targetLang);
        }
        Bob.instance.speak(`Language has been set to ${targetLang}!`);
        const channel = params.client.channels.cache.get(botDefaultTextChannelID);
        await channel.send(`Bob's recognition language has been set to ${targetLang}!`);
    },
};