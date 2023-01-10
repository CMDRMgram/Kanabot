const Discord = require("discord.js");
module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName(`ping`)
    .setDescription(`pong`),
    execute (interaction) {
        interaction.reply({ content: `Pong!` });
    }
}