const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var Rcon = require('rcon');
const fs = require('fs');
const voice = require('../events/voiceStateUpdate');
const request = require('request');

const serverIP = fs.readFileSync('commands/serverinfo/serverinfo.txt', 'utf8')
const serverPW = fs.readFileSync('commands/serverinfo/serverpw.txt', 'utf8')
const conn = new Rcon(serverIP, 27015, serverPW);

const mapsOfNoTrades = fs.readFileSync('commands/serverinfo/channel-mapsofnotrades.txt', 'utf8')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start a 10 Man Game'),


	async execute(interaction) {

        // Checking if user is an admin
		let adminJson = JSON.parse(fs.readFileSync('./commands/database/admin.json'));
		let adminCheck = false;
		for (let i = 0; i < adminJson.admins.length; i++) {
			if ((adminJson.admins[i].userid) == (interaction.user.id)) {
				adminCheck = true;
			}
		}

        
        if (adminCheck) {
            console.log('Commencing /start');

            // Starting the game
            conn.on('auth', function() {
                conn.send("mp_warmup_end");

                }).on('error', function(err) {
                console.log("Warmup Command Error: " + err);
            });
            
            conn.connect();

            // Send Embed 
            var startEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Warmup Ended');
            await interaction.reply({ embeds: [startEmbed]})


            // Sending Match Details
            try {
                aList = voice.getAList();
                bList = voice.getBList();

                let aListString = ""
                for (const element1 of aList) {
                    aListString += `<@${element1}>\n`
                }

                let bListString = ""
                for (const element2 of bList) {
                    bListString += `<@${element2}>\n`
                }

                const content = "List A and B:\n".concat(aListString.concat("\n".concat(bListString)));
                fs.appendFile('./log.txt', "\n".concat(content), function (err) {
                    if (err) return console.log(err);
                });

                // GET MAP NAME AND THUMBNAIL
                conn.on('auth', function() {
                    conn.send("status");

                    }).on('response', function(str) {
                        let status = str.split("\n");
                        let mapStr = ''.concat(status.filter((status) => status.startsWith("map")));
                        let workshopid = mapStr.split("/")[1];

                        if (workshopid != undefined) {

                            console.log(workshopid);
    
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
    
                                    let mapURL = (`https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopid}`);
                                    let mapName = (mapDetails.response.publishedfiledetails[0].title);
                                    let mapImage = (mapDetails.response.publishedfiledetails[0].preview_url);
    
                                    var matchEmbed = new MessageEmbed()
                                        .setColor('0xFF6F00')
                                        .setTitle(`\u200b${mapName}`)
                                        .setURL(mapURL)
                                        .addFields(
                                            { name: 'Team A:', value: `\u200b${aListString}`, inline: true},
                                            { name: 'Team B:', value: `\u200b${bListString}`, inline: true},
                                            )
                                        .setImage(mapImage);
                                    
                    
                                    await interaction.guild.channels.cache.get(`${mapsOfNoTrades}`).send({ embeds: [matchEmbed]});
                                    // Maps-of-No-Trades: 843111309058899998
    
                                } catch (error) {
                                    console.log("request():\n" + error)
                                }
                            });
                        } else console.log("Skipping Undefinied");



                    }).on('error', function(err) {
                    console.log("MatchEmbed Error: " + err);
                }); 
            } catch (error) {
                console.log("try loop: " + error);
            }

            conn.emit('end');
            console.log('Completed /start');
        } 
        else {
            // Missing Perms 
            var deniedEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Permission Denied').setDescription('Must be an Admin');
            await interaction.reply({embeds: [deniedEmbed], ephemeral: true });
        }
	},
};

