const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spinmap')
		.setDescription('Gets One Random Map'),


	async execute(interaction) {

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


			// Getting all the rows in the database
			function getData() {
				return new Promise((resolve, reject) => {
					db.all(`SELECT workshopID as id, mapName as name FROM pool`, (err, row) => {
						if (err) { reject(err); }
						resolve(row);
					});
				})
			}

			const data = await getData();

			function getMap() {
				return new Promise((resolve) => {
					
					const random = Math.floor(Math.random() * data.length);
					const map = (data[random]);

					
					resolve(map);
				})
			}

			const map = await getMap();
			var mapID = String(map.id);
			var mapIDField = String('Workshop ID: ' + map.id);
			var mapName = String(map.name);
			
			db.close((err) => {
			if (err) {
				console.error(err.message);
			}
			console.log('Close the database connection.');
			});


			// Embed 
			var poolEmbed = new MessageEmbed()
				.setColor('0xFF6F00')
				.setTitle('Retrieved Map: ' + mapName)
				.setURL('https://steamcommunity.com/sharedfiles/filedetails/?id='.concat(mapID))
				.setDescription('Workshop ID: ' + mapID)
				.setTimestamp();

				
			await interaction.reply(
				{ embeds: [poolEmbed],
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

