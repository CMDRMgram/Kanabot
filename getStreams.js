const TwitchApi = require("node-twitch").default;
const Discord = require("discord.js");
require("dotenv").config();

const twitch = new TwitchApi({
    client_id: `${process.env.TWITCHID}`,
    client_secret: `${process.env.TWITCHSECRET}`
});


let todayMinusOne = new Date()
todayMinusOne.setDate(todayMinusOne.getDate()-1)
let today = new Date()

todayMinusOne = todayMinusOne.toISOString().split('.')[0]+"Z"
today = today.toISOString().split('.')[0]+"Z"


module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName(`getclips`)
    .setDescription(`Get FF14 clips from the last 24 hours`)
    .addStringOption(option => option.setName('channels')
        .setDescription('Channel name(s), seperated with commas and no spaces eg: XenosysVex,ZeplaHQ,RinKarigani')
        .setRequired(true)),
    async execute (interaction) {
        // Arg Handling
        let args = {}
        for (let key of interaction.options.data) {
            args[key.name] = key.value
        }

        let channels = args.channels.split(',')

        let allclips = []
        let clips = await twitch.getClips({game_id: '24241', first: 100, started_at: `${todayMinusOne}`, ended_at: `${today}` });
        allclips = allclips.concat(clips.data)
        console.log(clips)
    
        while (clips.pagination != null) {
            clips = await twitch.getClips({game_id: '24241', first: 100, started_at: `${todayMinusOne}`, ended_at: `${today}`, after: clips.pagination });
            allclips = allclips.concat(clips.data)
        }
        allclips.pop()


        let list = ''

        allclips = allclips.filter(clip => channels.includes(clip.broadcaster_name) === true)
        if (allclips.length == 0) {
            return interaction.reply({ content: `No clips found for today, sorry`})
        }
        interaction.reply({ content: `Fetching todays clips for (${channels})` })
        for (let clip of allclips) {
                interaction.channel.send({ content: `${clip.title} - ${clip.broadcaster_name} - (${clip.url})`})
        }
        
    }
}