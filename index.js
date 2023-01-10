require("dotenv").config();
const fs = require('fs');
const Discord = require("discord.js");

// Discord client setup
const myIntents = new Discord.Intents();
myIntents.add(
	Discord.Intents.FLAGS.GUILDS,
	Discord.Intents.FLAGS.GUILD_PRESENCES, 
	Discord.Intents.FLAGS.GUILD_MEMBERS, 
	Discord.Intents.FLAGS.GUILD_MESSAGES, 
	Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, 
	Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
);
const discordClient = new Discord.Client({ intents: myIntents })

//Command detection
discordClient.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		command.category = folder;
		discordClient.commands.set(command.name, command);
	}
}


discordClient.once("ready", async() => {
	botLog(`Warden is now online! ⚡`, `high`);
	console.log(`[✔] Discord bot Logged in as ${discordClient.user.tag}!`);
})


// Switch Statements
if (enableDiscordBot === 1) { discordClient.login(process.env.TOKEN) } else { console.error(`WARN: Discord Bot Disabled`)}