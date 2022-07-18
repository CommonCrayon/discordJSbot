const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var Rcon = require('rcon');
const fs = require('fs')

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

                console.log(content);

                async function sendDelayMsg() {
                    await sleep(3000);
    
                    let array = content.split("\n");
                    let score = {
                        set current(name) {
                          this.log.push(name);
                        },
                        log: []
                      };
    
                    
                    array.forEach(element => {
                        if (element.startsWith("CT")) {
                            score.current = element;
                        }
                    });
                    
                    // Embed 
                    let rconEmbed = new MessageEmbed()
                        .setColor('0xFF6F00')
                        .setTitle('Match Score')
                        .setDescription(`\u200b${score.log}`);
    
                    await interaction.editReply({ embeds: [rconEmbed]});

                    scoreString = score.log.toString();
                    let scoreSplit = scoreString.split(" ");
                    console.log(scoreSplit);

                    if (scoreSplit[1] == '16' || scoreSplit [3] == '16') {clearInterval(timerId);}
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

