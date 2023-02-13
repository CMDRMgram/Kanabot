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
		.setDescription(`Use the buttons below to select your primary Job Role and Color.`)

        const row = new Discord.ActionRowBuilder()
        .addComponents(new Discord.ButtonBuilder().setCustomId('tankrole').setLabel('Tank').setStyle(Discord.ButtonStyle.Success).setEmoji("<:RoleTank:1073482465462726668>"),)
        .addComponents(new Discord.ButtonBuilder().setCustomId('healrole').setLabel('Healer').setStyle(Discord.ButtonStyle.Success).setEmoji("<:RoleHealer:1073482462505746452>"),)
        .addComponents(new Discord.ButtonBuilder().setCustomId('dpsrole').setLabel('DPS').setStyle(Discord.ButtonStyle.Success).setEmoji("<:RoleDPS:1073482460605714492>"),)
        .addComponents(new Discord.ButtonBuilder().setCustomId('norole').setLabel('No Job Role').setStyle(Discord.ButtonStyle.Success),)
	.addComponents(new Discord.ButtonBuilder().setCustomId('colorpink').setLabel('None').setStyle(Discord.ButtonStyle.Primary),)
	.addComponents(new Discord.ButtonBuilder().setCustomId('colorpurple').setLabel('None').setStyle(Discord.ButtonStyle.Primary),)
	.addComponents(new Discord.ButtonBuilder().setCustomId('colorblue').setLabel('None').setStyle(Discord.ButtonStyle.Primary),)
	.addComponents(new Discord.ButtonBuilder().setCustomId('colorgreen').setLabel('None').setStyle(Discord.ButtonStyle.Primary),)
	.addComponents(new Discord.ButtonBuilder().setCustomId('coloryellow').setLabel('None').setStyle(Discord.ButtonStyle.Primary),)
	.addComponents(new Discord.ButtonBuilder().setCustomId('colorred').setLabel('None').setStyle(Discord.ButtonStyle.Primary),)
	.addComponents(new Discord.ButtonBuilder().setCustomId('colororange').setLabel('None').setStyle(Discord.ButtonStyle.Primary),)
	.addComponents(new Discord.ButtonBuilder().setCustomId('colorcyan').setLabel('None').setStyle(Discord.ButtonStyle.Primary),)

        interaction.reply({ embeds: [returnEmbed], components: [row] });
    }
}
