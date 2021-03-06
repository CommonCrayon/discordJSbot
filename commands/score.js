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


            // Getting workshop id of the map being currently played.
            const connectionStatus = new Rcon((secretinfo.server.serverIP), 27015, (secretinfo.server.serverPassword)); 
            let workshopid = '';

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

            

            // Getting mapURL, mapName and mapImage with the workshopid retrieved.
            let mapURL = '';
            let mapName = '';
            let mapImage = '';

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

                    } catch (error) {console.log("request():\n" + error);}
                });

            }

            //let rconEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Match Score');
            //await interaction.editReply({ embeds: [rconEmbed]});
            let reply = await interaction.fetchReply();



            // LOOP FOR 30 SECONDS FOR GAME MATCH SCORES
            let timerId = setInterval(() => {
                
                // Get match score from the server
                const connectionScore = new Rcon((secretinfo.server.serverIP), 27015, (secretinfo.server.serverPassword));
                let matchScoreResponse = '';

                connectionScore.on('auth', function() {
                        connectionScore.send("get_score");
                        connectionScore.disconnect();

                    }).on('response', async function(str) {
                        matchScoreResponse = matchScoreResponse.concat(str);

                    }).on('error', function(err) {
                        console.log("Error: " + err);

                    }).on('end', async function() {
                        console.log("Ended Rcon");
                });
                connectionScore.connect();


                // Get player name and team from the server
                let playerResponse = '';
                const connectionPlayer = new Rcon((secretinfo.server.serverIP), 27015, (secretinfo.server.serverPassword));

                connectionPlayer.on('auth', function() {
                        connectionPlayer.send("get_playerid");
                        connectionPlayer.disconnect();

                    }).on('response', async function(str) {
                        playerResponse = playerResponse.concat(str);

                    }).on('error', function(err) {
                        console.log("Error: " + err);

                    }).on('end', async function() {
                        console.log("Ended Rcon");
                });
                connectionPlayer.connect();



                // Get number of rounds in the match.
                let maxRoundsResponse = '';
                const connectionMaxRounds = new Rcon((secretinfo.server.serverIP), 27015, (secretinfo.server.serverPassword));

                connectionMaxRounds.on('auth', function() {
                        connectionMaxRounds.send("mp_maxrounds");
                        connectionMaxRounds.disconnect();

                    }).on('response', async function(str) {
                        maxRoundsResponse = maxRoundsResponse.concat(str);

                    }).on('error', function(err) {
                        console.log("Error: " + err);

                    }).on('end', async function() {
                        console.log("Ended Rcon");
                });
                connectionMaxRounds.connect();


                // Finally, format and send message, using function.
                async function sendDelayMsg() {
                    await sleep(3000);

                    // FORMAT MATCH SCORE
                    let scoreArray = [':zero::zero:', ':zero::one:', ':zero::two:', ':zero::three:', ':zero::four:',
                                    ':zero::five:', ':zero::six:', ':zero::seven:', ':zero::eight:', ':zero::nine:',
                                    ':one::zero:', ':one::one:', ':one::two:', ':one::three:', ':one::four:',
                                    ':one::five:', ':one::six:'];

                    let matchScoreArray = matchScoreResponse.split("\n");
                    let score = '';
                    matchScoreArray.forEach(element => {if (element.startsWith("CT")) {score = element;}});
                    score = score.split(" ");
                    
                    let scoreCT = parseInt(score[1]);
                    let scoreT = parseInt(score[3]);



                    // FORMAT TEAMS
                    let teamT = '';
                    let teamCT = '';

                    let playerArray = playerResponse.split("\n");
                    playerArray.forEach(element => {
                        if (element.startsWith("Terrorists")) {
                            let str = element.replace('Terrorists ','');
                            teamT += (`<:t_:999177816161669241> ${str}\n`);
                        }
                        else if (element.startsWith("Counter-Terrorists")) {
                            let str = element.replace('Counter-Terrorists ','');
                            teamCT += (`<:ct:999177611706122320> ${str}\n`);
                        }
                    });



                    // Embed 
                    let rconEmbed = new MessageEmbed()
                        .setColor('0xFF6F00')
                        .setTitle(`10 Man: ${mapName}`)
                        .setURL(mapURL)
                        .addFields(
                            { name: `\u200b????????????${scoreArray[scoreT]}????????????`, value: `\u200b${teamT}` , inline: true},
                            { name: `\u200b????????????${scoreArray[scoreCT]}????????????`, value: `\u200b${teamCT}`, inline: true },
                            )
                        .setImage(mapImage)
                        .setTimestamp();
                        
                    await reply.edit({ embeds: [rconEmbed]});
                    
                    // Cases to end timer

                    // GET MAX ROUNDS
                    let maxRoundsArray = maxRoundsResponse.split("\n");
                    let maxRounds = '';
                    maxRoundsArray.forEach(element => {if (element.startsWith(`"mp_maxrounds"`)) {maxRounds = element;}});
                    maxRounds = maxRounds.split(" ");
                    maxRounds = maxRounds[2];
                    maxRounds = maxRounds.replaceAll("\"", "");
                    maxRounds = parseInt(maxRounds);

                    if (maxRounds == (scoreCT + scoreT)) {clearInterval(timerId);}
                    if (((maxRounds/2)+1) == scoreCT || ((maxRounds/2)+1) == scoreT) {clearInterval(timerId);}
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

