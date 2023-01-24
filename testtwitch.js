const TwitchApi = require("node-twitch").default;
const Discord = require("discord.js");
require("dotenv").config();
const fs = require('fs');

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
    let clipIDs = await fs.readFileSync('./data.json', 'utf-8').split(',')
    for (let clip of allclips) {
        
        if (clipIDs.includes(clip.id) == false) {
            clipIDs.push(`${clip.id}`)
        }
    }
    console.log(clipIDs)
    fs.writeFileSync('./data.json', clipIDs.join(',') , 'utf-8'); 

    //console.log(allclips)
}

getClips();