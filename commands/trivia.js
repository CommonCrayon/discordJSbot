const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Play a Trivia Question!'),

	async execute(interaction) {

		// Embed 
		const triviaEmbed = new MessageEmbed()
			.setThumbnail('https://i.imgur.com/cuhu5P2.png')
			.setColor('0xFF6F00')
			.setTitle('TriviaTitle')
			.setDescription('Triva Question')
			.addFields(
				{ name: 'A', value: "A Answer"},
				{ name: 'B', value: "B Answer" },
				{ name: 'C', value: "C Answer"},
				{ name: 'D', value: "D Answer"},
				)
			.setFooter('Difficulty: ', 'https://i.imgur.com/nuEpvJd.png');

		
		// Buttons
		const triviabuttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('A')
					.setLabel('A Answer')
					.setStyle('PRIMARY')
					.setEmoji('🇦'),

				new MessageButton()
					.setCustomId('B')
					.setLabel('B Answer')
					.setStyle('PRIMARY')
					.setEmoji('🇧'),

				new MessageButton()
					.setCustomId('C')
					.setLabel('C Answer')
					.setStyle('PRIMARY')
					.setEmoji('🇨'),

                new MessageButton()
					.setCustomId('D')
					.setLabel('D Answer')
					.setStyle('PRIMARY')
					.setEmoji('🇩'),
			);

		await interaction.reply(
			{  embeds: [triviaEmbed], 
			components: [triviabuttons],
		}); 
	},
};