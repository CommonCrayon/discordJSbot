const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var Rcon = require('rcon');
const fs = require('fs');
const voice = require('../events/voiceStateUpdate');
const request = require('request');

let secretinfo = JSON.parse(fs.readFileSync('commands/database/secretinfo.json'));
const conn = new Rcon((secretinfo.server.serverIP), 27015, (secretinfo.server.serverPassword));

// Sleep Function
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

let wid = {
    set current(name) {
      this.log = (name);
    },
    log: String
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start a 10 Man Game'),


	async execute(interaction) {

        // Checking if user is an admin
		let adminJson = JSON.parse(fs.readFileSync('./commands/database/admin.json'));
		let adminCheck = false;
		for (let i = 0; i < adminJson.admins.length; i++) {
			if ((adminJson.admins[i].userid) == (interaction.user.id)) adminCheck = true;
		}

        
        if (adminCheck) {
            console.log('Commencing /start');

            // GET MAP NAME AND THUMBNAIL
            conn.on('auth', function() {
                conn.send("mp_warmup_end");
                conn.send("status");
                
                let dateTime = new Date();
                console.log(dateTime);

                }).on('response', function(str) {
                    let status = str.split("\n");
                    let mapStr = ''.concat(status.filter((status) => status.startsWith("map")));
                    let workshopid = mapStr.split("/")[1];

                    if (workshopid != undefined) wid.current = workshopid;
                    

                    console.log("wid: " + wid.log);

                }).on('error', function(err) {
                console.log("MatchEmbed Error: " + err);
            });

            conn.connect();
            // Send Embed 
            var startEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Warmup Ended');
            await interaction.reply({ embeds: [startEmbed]})

            aList = voice.getAList();
            bList = voice.getBList();

            let aListString = "";
            for (const element1 of aList) { aListString += `<@${element1}>\n` }

            let bListString = "";
            for (const element2 of bList) { bListString += `<@${element2}>\n` }

            // Waiting for Status to produce output
            async function sendDelayMsg() {
                await sleep(10000);
                console.log(wid.log);
                
                if (wid.log != undefined) {
        
                    var options = {
                        'method': 'POST',
                        'url': 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/',
                        'headers': {
                        },
                        formData: {
                        'itemcount': '1',
                        'publishedfileids[0]': `${wid.log}`
                        }
                    };
                    
                    request(options, async function (error, response) {
                        if (error) throw new Error(error);
                        try {
                            let mapDetails = JSON.parse(response.body);

                            let mapURL = (`https://steamcommunity.com/sharedfiles/filedetails/?id=${wid.log}`);
                            let mapName = (mapDetails.response.publishedfiledetails[0].title);
                            let mapImage = (mapDetails.response.publishedfiledetails[0].preview_url);

                            var matchEmbed = new MessageEmbed()
                                .setColor('0xFF6F00')
                                .setTitle(`10 Man: ${mapName}`)
                                .setURL(mapURL)
                                .addFields(
                                    { name: 'Team A:', value: `\u200b${aListString}`, inline: true},
                                    { name: 'Team B:', value: `\u200b${bListString}`, inline: true},
                                    )
                                .setImage(mapImage)
                                .setTimestamp();
                            
                            await interaction.guild.channels.cache.get(`${secretinfo.channelID}`).send({ embeds: [matchEmbed]});
                            

                        } catch (error) {
                            console.log("request():\n" + error)
                        }
                    });
                    
                } else console.log("Skipping Undefinied");
            }

            await sendDelayMsg();
            console.log('Completed /start');
        } 
        else {
            // Missing Perms 
            var deniedEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Permission Denied').setDescription('Must be an Admin');
            await interaction.reply({embeds: [deniedEmbed], ephemeral: true });
        }
	},
};

