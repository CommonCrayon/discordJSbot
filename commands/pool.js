const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pool')
		.setDescription('Displays the Map Pool'),


	async execute(interaction) {

		const sqlite3 = require('sqlite3').verbose();

		// open the database
		let db = new sqlite3.Database('./commands/database/10manpool.db', sqlite3.OPEN_READWRITE, (err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Connected to the database.');
		});

		db.serialize(() => {
		  db.each(`SELECT workshopID as id,
						  mapName as name
				   FROM pool`, (err, row) => {
			if (err) {
			  console.error(err.message);
			}
			console.log(row.id + "\t" + row.name);
		  });
		});

		
		db.close((err) => {
		  if (err) {
			console.error(err.message);
		  }
		  console.log('Close the database connection.');
		});
		
		// Embed 
		var poolEmbed = new MessageEmbed()
			.setColor('0xFF6F00')
			.setTitle('10 Man Map Pool')
			.setURL('https://10man.commoncrayon.com/')
			.setDescription('Join a 10 Man!')
			.addFields(
				{ name: 'Map:', value: 'Lure\n' + mapList},
				)
			.setFooter('Number of Maps: ADD', 'https://i.imgur.com/nuEpvJd.png');


		// Buttons
		var buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('leftBtn')
					.setStyle('PRIMARY')
					.setEmoji('⬅️'),

				new MessageButton()
					.setCustomId('rightBtn')
					.setStyle('PRIMARY')
					.setEmoji('➡️'),
			);

			
		await interaction.reply(
			{ embeds: [poolEmbed],
			components: [buttons],
		})
	},
};

