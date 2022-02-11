const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pool')
		.setDescription('Displays the Map Pool'),


	async execute(interaction) {
		
		// Embed 
		var poolEmbed = new MessageEmbed()
			.setColor('0xFF6F00')
			.setTitle('10 Man Map Pool')
			.setURL('https://10man.commoncrayon.com/')
			.setDescription('Join a 10 Man!')
			.addFields(
				{ name: 'Map:', value: 'MapList'},
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

