const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var Rcon = require('rcon');
const fs = require('fs');
const request = require('request');

let secretinfo = JSON.parse(fs.readFileSync('commands/database/secretinfo.json'));

// Sleep Function
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('score')
		.setDescription('Test - Prints Match Score'),


	async execute(interaction) {

        // Checking if user is an admin
		let adminJson = JSON.parse(fs.readFileSync('./commands/database/admin.json'));
		let adminCheck = false;
		for (let i = 0; i < adminJson.admins.length; i++) {
			if ((adminJson.admins[i].userid) == (interaction.user.id)) adminCheck = true;
		}
        
        if (adminCheck) {
            console.log("Commencing /score ");
            await interaction.deferReply();

            const connectionStatus = new Rcon((secretinfo.server.serverIP), 27015, (secretinfo.server.serverPassword)); 
            let workshopid = '';

            // GET MAP NAME AND THUMBNAIL
            connectionStatus.on('auth', function() {
                connectionStatus.send("status");
                connectionStatus.disconnect();

                }).on('response', function(str) {
                    let status = str.split("\n");
                    let status1 = ''.concat(status.filter((status) => status.startsWith("map")));
                    let status2 = status1.split("/")[1];
                    if (status2 != undefined) workshopid = String(status2);

                }).on('error', function(err) {
                    console.log("Error: " + err);

                }).on('end', function() {
                    console.log("Ended start");
            });
            connectionStatus.connect();
            await sleep(5000);

            let mapURL = '';
            let mapName = '';
            let mapImage = '';

            console.log(workshopid);
            if (workshopid != undefined) {
                
        
                var options = {
                    'method': 'POST',
                    'url': 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/',
                    'headers': {
                    },
                    formData: {
                    'itemcount': '1',
                    'publishedfileids[0]': `${workshopid}`
                    }
                };
                
                request(options, async function (error, response) {
                    if (error) throw new Error(error);
                    try {
                        let mapDetails = JSON.parse(response.body);

                        mapURL = (`https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopid}`);
                        mapName = (mapDetails.response.publishedfiledetails[0].title);
                        mapImage = (mapDetails.response.publishedfiledetails[0].preview_url);

                        let matchEmbed = new MessageEmbed()
                            .setColor('0xFF6F00')
                            .setTitle(`10 Man: ${mapName}`)
                            .setURL(mapURL)
                            .setImage(mapImage)
                            .setTimestamp();
                        
                        await interaction.editReply({ embeds: [matchEmbed]});
                        

                    } catch (error) {
                        console.log("request():\n" + error)
                    }
                });

            }

            //let rconEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Match Score');
            //await interaction.editReply({ embeds: [rconEmbed]});
            let reply = await interaction.fetchReply();



            // LOOP FOR 30 SECONDS FOR GAME MATCH SCORES
            let timerId = setInterval(() => {
                let content = '';
                let conn = new Rcon((secretinfo.server.serverIP), 27015, (secretinfo.server.serverPassword));

                conn.on('auth', function() {
                        conn.send("get_score");
                        conn.disconnect();

                    }).on('response', async function(str) {
                        content = content.concat(str);

                    }).on('error', function(err) {
                        console.log("Error: " + err);

                    }).on('end', async function() {
                        console.log("Ended Rcon");
                });
                conn.connect();

                let content2 = '';
                let conn2 = new Rcon((secretinfo.server.serverIP), 27015, (secretinfo.server.serverPassword));

                conn2.on('auth', function() {
                        conn2.send("get_playerid");
                        conn2.disconnect();

                    }).on('response', async function(str) {
                        content2 = content2.concat(str);

                    }).on('error', function(err) {
                        console.log("Error: " + err);

                    }).on('end', async function() {
                        console.log("Ended Rcon");
                });
                conn2.connect();

                async function sendDelayMsg() {
                    await sleep(3000);


                    // FORMAT MATCH SCORE
                    let array = content.split("\n");
                    let score = '';

                    array.forEach(element => {
                        if (element.startsWith("CT")) {score = element;}
                    });

                    score = score.split(" ");
                    
                    let scoreCT = score[1];
                    let scoreT = score[3];

                    let scoreArray = [':zero::zero:', ':zero::one:', ':zero::two:', ':zero::three:', ':zero::four:', 
                                    ':zero::five:', ':zero::six:', ':zero::seven:', ':zero::eight:', ':zero::nine:', 
                                    ':one::zero:', ':one::one:', ':one::two:', ':one::three:', ':one::four:', ':one::five:', ':one::six:'];

                    // FORMAT TEAMS
                    let teamT = '';
                    let teamCT = '';


                    let array2 = content2.split("\n");
                    array2.forEach(element => {
                        if (element.startsWith("Terrorists")) {
                            let str = element.replace('Terrorists ','');
                            teamT += (`<:t_:999154326020833311> ${str}\n`);
                        }
                        else if (element.startsWith("Counter-Terrorists")) {
                            let str = element.replace('Counter-Terrorists ','');
                            teamCT += (`<:ct:999154324280184873> ${str}\n`);
                        }
                    });

                    // Embed 
                    let rconEmbed = new MessageEmbed()
                        .setColor('0xFF6F00')
                        .setTitle(`10 Man: ${mapName}`)
                        .setURL(mapURL)
                        .addFields(
                            { name: `➖➖➖➖${scoreArray[scoreT]}➖➖➖➖`, value: `\u200b${teamT}` , inline: true},
                            { name: `➖➖➖➖${scoreArray[scoreCT]}➖➖➖➖`, value: `\u200b${teamCT}`, inline: true })
                        .setImage(mapImage)
                        .setTimestamp();
                        
                    await reply.edit({ embeds: [rconEmbed]});
                    


                    // Cases to end timer
                    if (score[1] == '16' || score[3] == '16') {clearInterval(timerId);}
                    if (score[1] == '15' && score[3] == '15') {clearInterval(timerId);}
                }
                sendDelayMsg();

            }, 30000);

            setTimeout(() => { clearInterval(timerId); }, 3600000);
            console.log("Completed /score");
        
        } else {
            // Missing Perms 
            var deniedEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Permission Denied').setDescription('Must be an Admin');
            await interaction.reply({embeds: [deniedEmbed], ephemeral: true });
        }
	},
};

