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

async function getClips(){
    let allclips = []
    let clips = await twitch.getClips({game_id: '24241', first: 100, started_at: `${todayMinusOne}`, ended_at: `${today}` });
    allclips = allclips.concat(clips.data)

    while (clips.pagination != null) {
        clips = await twitch.getClips({game_id: '24241', first: 100, started_at: `${todayMinusOne}`, ended_at: `${today}`, after: clips.pagination });
        allclips = allclips.concat(clips.data)
        console.log(`Fetchin: ${clips.pagination}`)
    }
    allclips.pop()
    for (let clip of allclips) {
        console.log(clip.title)
    }

    //console.log(allclips)
}

getClips();