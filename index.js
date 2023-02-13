// Imported Modules
require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder, Collection } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

// Discord client setup
const serverIntents = new IntentsBitField(3276799);
const bot = new Client({ intents: serverIntents })


// Command folder management
bot.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		command.category = folder;
		if (command.data === undefined) {
			bot.commands.set(command.name, command) // For non-slash commands
		} else {
			bot.commands.set(command.data.name, command) // For slash commands
		}
	}
}

/**
 * Deploys Command objects to the Discord API registering any changes
 * @author  (Mgram) Marcus Ingram
 */
async function deployCommands() {
	const commands = [];
	const commandFolders = fs.readdirSync('./commands');
	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`./commands/${folder}/${file}`);
			command.category = folder;
			if (command.data !== undefined) {
				commands.push(command.data.toJSON());
			}
		}
	}
	const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
	
	try {
		await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
			{ body: commands },
		);

		console.log('✅ Successfully registered application commands');
	} catch (error) {
		console.error(error);
	}
}



/**
 * Event handler for Bot Login, manages post-login setup
 * @author  (Mgram) Marcus Ingram
 */
bot.once("ready", async() => {
	await deployCommands();
	console.log(`✅ bot is now online! logged in as ${bot.user.tag}`)
})

/**
 * Event handler for Slash Commands, takes interaction to test before executing command code.
 * @author  (Mgram) Marcus Ingram
 */
bot.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		const command = bot.commands.get(interaction.commandName);
		if (!command) {
			console.log('WARNING: Unknown command detected.');
			return;
		}
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
	
	async function setColors(newColor) {
		interaction.member.roles.remove("1074484970158030879")
		interaction.member.roles.remove("1074485067302309959")
		interaction.member.roles.remove("1074485131357720626")
		interaction.member.roles.remove("1074485178174550017")
		interaction.member.roles.remove("1074485239398813756")
		interaction.member.roles.remove("1074485296743321710")
		interaction.member.roles.remove("1074485344151552082")
		interaction.member.roles.remove("1074485432089313411")
		interaction.member.roles.add(`${newColor}`)
	}

	if (interaction.isButton()) {
		interaction.deferUpdate();
		switch (interaction.customId) {
			case "tankrole":
				interaction.member.roles.add("971728838100910140")
				interaction.member.roles.remove("971728859017920513")
				interaction.member.roles.remove("971728899547480125")
				break;
			case "healrole":
				interaction.member.roles.add("971728859017920513")
				interaction.member.roles.remove("971728838100910140")
				interaction.member.roles.remove("971728899547480125")
				break;
			case "dpsrole":
				interaction.member.roles.add("971728899547480125")
				interaction.member.roles.remove("971728838100910140")
				interaction.member.roles.remove("971728859017920513")
				break;
			case "norole":
				interaction.member.roles.remove("971728899547480125")
				interaction.member.roles.remove("971728838100910140")
				interaction.member.roles.remove("971728859017920513")
				break;
			case "colorpink":
				setColors("1074484970158030879")
				break;
			case "colorpurple":
				setColors("1074485067302309959")
				break;
			case "colorblue":
				setColors("1074485131357720626")
				break;
			case "colorgreen":
				setColors("1074485178174550017")
				break;
			case "coloryellow":
				setColors("1074485239398813756")
				break;
			case "colorred":
				setColors("1074485296743321710")
				break;
			case "colororange":
				setColors("1074485344151552082")
				break;
			case "colorcyan":
				setColors("1074485432089313411")
				break;
			default:
				console.log('no matching option found for button pressed')
			
		}
		console.log(`Role assignment used by ${interaction.member}`)
	}
});

bot.login(process.env.TOKEN)

// General error handling
process.on('uncaughtException', function (err) {
	console.log(`⛔ Fatal error occured:`)
	console.error(err);
});
