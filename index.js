// Imported Modules
require("dotenv").config();
const { Client, IntentsBitField, EmbedBuilder, Collection } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const cron = require('node-cron');
const TwitchApi = require("node-twitch").default;

// Discord client setup
const serverIntents = new IntentsBitField(3276799);
const bot = new Client({ intents: serverIntents })

const twitch = new TwitchApi({
	client_id: `${process.env.TWITCHID}`,
	client_secret: `${process.env.TWITCHSECRET}`
});

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

	if (interaction.isButton()) {
		if (interaction.customId === "tankrole") {
			interaction.deferUpdate();
			interaction.member.roles.add("971728838100910140")
			interaction.member.roles.remove("971728859017920513")
			interaction.member.roles.remove("971728899547480125")
		} else if (interaction.customId === "healrole") {
			interaction.deferUpdate();
			interaction.member.roles.add("971728859017920513")
			interaction.member.roles.remove("971728838100910140")
			interaction.member.roles.remove("971728899547480125")
		} else if (interaction.customId === "dpsrole") {
			interaction.deferUpdate();
			interaction.member.roles.add("971728899547480125")
			interaction.member.roles.remove("971728838100910140")
			interaction.member.roles.remove("971728859017920513")
		} else if (interaction.customId === "norole") {
			interaction.deferUpdate();
			interaction.member.roles.remove("971728899547480125")
			interaction.member.roles.remove("971728838100910140")
			interaction.member.roles.remove("971728859017920513")
		}
	}
});

bot.login(process.env.TOKEN)

// General error handling
process.on('uncaughtException', function (err) {
	console.log(`⛔ Fatal error occured:`)
	console.error(err);
});