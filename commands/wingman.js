const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var Rcon = require('rcon');
const fs = require('fs');

let secretinfo = JSON.parse(fs.readFileSync('commands/database/secretinfo.json'));
const conn = new Rcon((secretinfo.server.serverIP), 27015, (secretinfo.server.serverPassword));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wingman')
		.setDescription('Executes wingman config and starts a game'),


	async execute(interaction) {

        // Checking if user is an admin
		let adminJson = JSON.parse(fs.readFileSync('./commands/database/admin.json'));
		let adminCheck = false;
		for (let i = 0; i < adminJson.admins.length; i++) {
			if ((adminJson.admins[i].userid) == (interaction.user.id)) adminCheck = true;
		}

        if (adminCheck) {
            console.log('Commencing /wingman');

            // Executing wingman config
            conn.on('auth', function() {
                conn.send("exec gamemode_competitive2v2");

                }).on('error', function(err) {
                console.log("Wingman cfg Command Error: " + err);
            });

            // Starting the game
            conn.on('auth', function() {
                conn.send("mp_warmup_end");

                }).on('error', function(err) {
                console.log("Warmup Command Error: " + err);
            });
            
            conn.connect();

            // Send Embed 
            var startEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Started Wingman Game');
            await interaction.reply({ embeds: [startEmbed]})


            conn.emit('end');
            console.log('Completed /wingman');
        } 
        else {
            // Missing Perms 
            var deniedEmbed = new MessageEmbed().setColor('0xFF6F00').setTitle('Permission Denied').setDescription('Must be an Admin');
            await interaction.reply({embeds: [deniedEmbed], ephemeral: true });
        }
	},
};

