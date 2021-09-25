const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inventoryvalue')
		.setDescription('Get value of Steam Inventory')
		.addStringOption(option => option.setName('steamid').setDescription('Enter a Steam ID').setRequired(true)),

	async execute(interaction) {

		const steamID = interaction.options.getString('steamid');

		const res = await axios.get(`http://csgobackpack.net/api/GetInventoryValue/?id=${steamID}`, {
			headers: {
				'Test-Header': 'test-value'
			}
			});
        
        console.log(res)

		// Embed 
		const triviaEmbed = new MessageEmbed()
			.setColor('0xFF6F00')
			.setTitle("Inventory Value")
			.setDescription("\u200b")
			.addFields(
				{ name: "\u200b", value: "sefg"},
				)
			.setFooter(`Made by CommonCrayon`, 'https://i.imgur.com/nuEpvJd.png');

		
		await interaction.reply({  
				embeds: [triviaEmbed]
			}) 

	}
};
