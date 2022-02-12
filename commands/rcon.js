const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
var Rcon = require('rcon');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rcon')
		.setDescription('Send a command to the Server')
        .addStringOption(option => option.setName('command').setDescription('Enter a Rcon Command').setRequired(true)),


	async execute(interaction) {

        // CommonCrayon, Thisted, Cktos, Karl, Cajeb, Dashtay
        admin = ['277360174371438592', '114714586799800323', '335786316782501888', '342426491675738115', '216678626182168577', '148237004830670848']
        
        if (admin.includes(interaction.user.id)) {
            command = interaction.options.getString('command');

            var conn = new Rcon('51.254.54.227', 27015, 'noyarc');
            
            conn.on('auth', function() {
    
                console.log("Authenticated");
                console.log("Sending command: " + command)
    
                conn.send(command);
                }).on('response', function(str) {
                console.log("Response: " + str);
                }).on('error', function(err) {
                console.log("Error: " + err);
                }).on('end', function() {
                console.log("Connection closed");
                process.exit();
            });
    
            conn.connect();
    
    
            // Embed 
            var rconEmbed = new MessageEmbed()
                .setColor('0xFF6F00')
                .setTitle('Successfully sent command: ' + command)
                .setDescription('RESPONSE WILL BE ADDED')
        
        } else {
            // Missing Perms 
            var rconEmbed = new MessageEmbed()
                .setColor('0xFF6F00')
                .setTitle('Permission Denied')
        }


			
		await interaction.reply(
			{ embeds: [rconEmbed],
		})
	},
};

