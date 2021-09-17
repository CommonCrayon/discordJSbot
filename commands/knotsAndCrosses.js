const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('knotscrosses')
		.setDescription('Play Knots & Crosses!')
        .addUserOption(option => option.setName('player1').setDescription('Enter Player 1'))
        .addUserOption(option => option.setName('player2').setDescription('Enter Player 2')),

	async execute(interaction) {

        const player1 = interaction.options.getUser('player1');
        const player2 = interaction.options.getUser('player2');
				
		// Buttons
		const buttonRow1 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('r1A')
					.setLabel('\u200b')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r1B')
					.setLabel('\u200b')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r1C')
					.setLabel('\u200b')
					.setStyle('PRIMARY'),
			);

        const buttonRow2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('r2A')
					.setLabel('\u200b')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r2B')
					.setLabel('\u200b')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r2C')
					.setLabel('\u200b')
					.setStyle('PRIMARY'),
			);

        const buttonRow3 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('r3A')
					.setLabel('\u200b')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r3B')
					.setLabel('\u200b')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r3C')
					.setLabel('\u200b')
					.setStyle('PRIMARY'),
			);
		await interaction.reply({
				content: (`${player1} vs ${player2}`),
				components: [buttonRow1, buttonRow2, buttonRow3 ]
			}) 
        
        
        const filter = i => i.customId === 'primary' && i.user.id === '122157285790187530';
		
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 }); //time: 15 seconds


		collector.on('collect', async i => {

			user = (`<@${i.user.id}>`);
			buttonClicked = (i.customId);

			if (buttonClicked === "A" ) {

			}

			else if (buttonClicked === "B" ) {

			}

			else if (buttonClicked === "C" ) {

			}

			else if (buttonClicked === "D" ) {

			}
		
			await i.deferUpdate();
		});

		collector.on('end', async i => {
			console.log("Ended Trivia Message");


			
			interaction.channel.send(
				{  content: `Player won`,
			});
		});
	}
};