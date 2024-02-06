const Bob = require("../../voice");

module.exports = {
    names: ['gpt','help me', 'giúp tôi'],
    async execute(params) {
        Bob.instance.gpt(params.client, params.input, params.username);
    },
};