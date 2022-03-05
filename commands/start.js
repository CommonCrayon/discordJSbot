const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
var Rcon = require('rcon');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start a 10 Man Game'),


	async execute(interaction) {

        // CommonCrayon, Thisted, Cktos, Karl, Cajeb, Dashtay
        admin = ['277360174371438592', '114714586799800323', '335786316782501888', '342426491675738115', '216678626182168577', '148237004830670848']
        
        if (admin.includes(interaction.user.id)) {
            
            const fs = require('fs')

            fs.readFile('commands/serverinfo/serverip.txt', (err, data) => {
                if (err) throw err;   
                return serverip = data.toString();
            })

            var conn = new Rcon('51.254.54.227', 27015, 'noyarc');

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

            conn.connect();

            
            // Embed 
            var startEmbed = new MessageEmbed()
                .setColor('0xFF6F00')
                .setTitle('Warmup Ended')

            await interaction.reply(
                { embeds: [startEmbed],
            })

            


        } else {
            // Missing Perms 
            var deniedEmbed = new MessageEmbed()
                .setColor('0xFF6F00')
                .setTitle('Permission Denied')
                .setDescription('Must be an Admin')

            await interaction.reply(
                {
                embeds: [deniedEmbed], 
                ephemeral: true 
            })
        }
	},
};

