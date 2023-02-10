const Discord = require("discord.js");


module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName(`roles`)
    .setDescription(`Select your preferred main role`)
    .setDefaultPermission(false),
    permissions: 2,
    async execute (interaction) {
        const returnEmbed = new Discord.EmbedBuilder()
		.setColor('#FF7100')
		.setTitle("**Role Selection**")
		.setDescription(`Use the buttons below to select your primary Job Role.`)

        const row = new Discord.ActionRowBuilder()
        .addComponents(new Discord.ButtonBuilder().setCustomId('tankrole').setLabel('Tank').setStyle(Discord.ButtonStyle.Success).setEmoji("<:RoleTank:1073482465462726668>"),)
        .addComponents(new Discord.ButtonBuilder().setCustomId('healrole').setLabel('Healer').setStyle(Discord.ButtonStyle.Success).setEmoji("<:RoleHealer:1073482462505746452>"),)
        .addComponents(new Discord.ButtonBuilder().setCustomId('dpsrole').setLabel('DPS').setStyle(Discord.ButtonStyle.Success).setEmoji("<:RoleDPS:1073482460605714492>"),)
        .addComponents(new Discord.ButtonBuilder().setCustomId('norole').setLabel('None').setStyle(Discord.ButtonStyle.Success),)

        interaction.reply({ embeds: [returnEmbed], components: [row] });
    }
}