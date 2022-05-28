const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var Rcon = require('rcon');
const fs = require('fs');
const voice = require('../events/voiceStateUpdate');


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
            const serverIP = fs.readFileSync('commands/serverinfo/serverinfo.txt', 'utf8')
            const serverPW = fs.readFileSync('commands/serverinfo/serverpw.txt', 'utf8')

            var conn = new Rcon(serverIP, 27015, serverPW);

            conn.on('auth', function() {
                console.log("Authenticated");
                console.log("Sending command: mp_warmup_end")
                
                conn.send("mp_warmup_end");

                }).on('response', function(str) {
                console.log("Response: " + str);

                }).on('error', function(err) {
                console.log("Error: " + err);

                }).on('end', function() {
                console.log("Connection closed");
            });

            conn.connect(); // Disconnect as well???
            
            // Embed 
            var startEmbed = new MessageEmbed()
                .setColor('0xFF6F00')
                .setTitle('Warmup Ended');


            await interaction.reply({ embeds: [startEmbed]})

            try {
                aList = voice.getAList();
                bList = voice.getBList();

                console.log(aList, bList);


                let aListString = ""
                for (const element1 of aList) {
                    aListString += `<@${element1}>\n`
                }

                let bListString = ""
                for (const element2 of bList) {
                    bListString += `<@${element2}>\n`
                }

                var matchEmbed = new MessageEmbed()
                    .setColor('0xFF6F00')
                    .setTitle('10 Man')
                    //.setDescription('Lure')
                    .addFields(
                        { name: 'Team A:', value: `${aListString}`, inline: true},
                        { name: 'Team B:', value: `${bListString}`, inline: true},
                        )
                    //.setImage('https://steamuserimages-a.akamaihd.net/ugc/1823396704049197283/35A17DD810555CF939DB051B858BED9430A99032/')
                    ;

                await interaction.guild.channels.cache.get("843111309058899998").send({ embeds: [matchEmbed]});


            } catch (error) {
                console.log(error);
            }
        } 
        else {
            // Missing Perms 
            var deniedEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Permission Denied').setDescription('Must be an Admin');
            await interaction.reply({embeds: [deniedEmbed], ephemeral: true });
        }
	},
};

