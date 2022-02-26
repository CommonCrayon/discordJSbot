const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removemap')
		.setDescription('Removes a Map from the Pool')
		.addStringOption(option => option.setName('workshopid').setDescription('Enter a Workshop ID').setRequired(true)),


	async execute(interaction) {

		workshopid = interaction.options.getString('workshopid');

        // CommonCrayon, Thisted, Cktos, Karl, Cajeb, Dashtay
        admin = ['277360174371438592', '114714586799800323', '335786316782501888', '342426491675738115', '216678626182168577', '148237004830670848']
        
        if (admin.includes(interaction.user.id)) {		

			// open the database
			let db = new sqlite3.Database('./commands/database/10manpool.db', sqlite3.OPEN_READWRITE, (err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('Connected to the database.');
			});


			// Deleting map
			db.run(`DELETE FROM pool WHERE workshopID=?`, workshopid, function(err) {
				if (err) {
				return console.error(err.message);
				}
				console.log(`Row(s) deleted ${this.changes}`);
			});

			
			db.close((err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('Close the database connection.');
			});


			// Embed 
			var removeEmbed = new MessageEmbed()
				.setColor('0xFF6F00')
				.setTitle('Successfully Removed Map: ' + workshopid)
				.setTimestamp();

			await interaction.reply(
				{ embeds: [removeEmbed],
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

