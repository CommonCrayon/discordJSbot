const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
var Rcon = require('rcon');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Change map on the server')
        .addStringOption(option => option.setName('workshopid').setDescription('Enter a Workshop ID').setRequired(true)),


	async execute(interaction) {

        workshopid = interaction.options.getString('workshopid');

        admin = ['277360174371438592', '114714586799800323', '335786316782501888', '342426491675738115', '216678626182168577', '148237004830670848']
        
        if (admin.includes(interaction.user.id)) {
            var conn = new Rcon('51.254.54.227', 27015, 'noyarc');
            
            conn.on('auth', function() {

                conn.send(('host_workshop_map ').concat(workshopid));
                }).on('response', function(str) {
                console.log("Response: " + str);
                }).on('error', function(err) {
                console.log("Error: " + err);
                }).on('end', function() {
                console.log("Connection closed");
            });

            conn.connect();

            // Embed 
            var mapEmbed = new MessageEmbed()
                .setColor('0xFF6F00')
                .setTitle('Successfully Changed Map to: ' + workshopid)
                .setURL('https://steamcommunity.com/sharedfiles/filedetails/?id='.concat(workshopid))

            await interaction.reply(
                { embeds: [mapEmbed],
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

