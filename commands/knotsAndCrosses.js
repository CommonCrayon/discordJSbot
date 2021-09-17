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
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r1B')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r1C')
					.setStyle('PRIMARY'),
			);

        const buttonRow2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('r2A')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r2B')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r2C')
					.setStyle('PRIMARY'),
			);

        const buttonRow3 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('r3A')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r3B')
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('r3C')
					.setStyle('PRIMARY'),
			);
		await interaction.reply({
				components: [buttonRow1, buttonRow2, buttonRow3 ]
			}) 
        
        
        const filter = i => i.customId === 'primary' && i.user.id === '122157285790187530';
		
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 }); //time: 15 seconds

		var correctEntries = [];
		var incorrectEntries = [];

		collector.on('collect', async i => {

			user = (`<@${i.user.id}>`);
			buttonClicked = (i.customId);
			console.log(`Trivia Button Clicked:\n   User: ${user}\n   ButtonClicked: ${buttonClicked}`);

			if (buttonClicked === "A" ) {
				if (corAnsNum === 0){

					if (correctEntries.indexOf(user) > -1) {
						correctEntries.splice(correctEntries.indexOf(user), 1);
					}
					if (incorrectEntries.indexOf(user) > -1) {
						incorrectEntries.splice(incorrectEntries.indexOf(user), 1);
					}
	
					correctEntries.push(user);
				}
				else {

					if (correctEntries.indexOf(user) > -1) {
						correctEntries.splice(correctEntries.indexOf(user), 1);
					}
					if (incorrectEntries.indexOf(user) > -1) {
						incorrectEntries.splice(incorrectEntries.indexOf(user), 1);
					}

					incorrectEntries.push(user);
				}
			}

			else if (buttonClicked === "B" ) {
				if (corAnsNum === 1){

					if (correctEntries.indexOf(user) > -1) {
						correctEntries.splice(correctEntries.indexOf(user), 1);
					}
					if (incorrectEntries.indexOf(user) > -1) {
						incorrectEntries.splice(incorrectEntries.indexOf(user), 1);
					}

					correctEntries.push(user);
				}
				else {

					if (correctEntries.indexOf(user) > -1) {
						correctEntries.splice(correctEntries.indexOf(user), 1);
					}
					if (incorrectEntries.indexOf(user) > -1) {
						incorrectEntries.splice(incorrectEntries.indexOf(user), 1);
					}

					incorrectEntries.push(user);
				}
			}

			else if (buttonClicked === "C" ) {
				if (corAnsNum === 2){

					if (correctEntries.indexOf(user) > -1) {
						correctEntries.splice(correctEntries.indexOf(user), 1);
					}
					if (incorrectEntries.indexOf(user) > -1) {
						incorrectEntries.splice(incorrectEntries.indexOf(user), 1);
					}

					correctEntries.push(user);
				}
				else {

					if (correctEntries.indexOf(user) > -1) {
						correctEntries.splice(correctEntries.indexOf(user), 1);
					}
					if (incorrectEntries.indexOf(user) > -1) {
						incorrectEntries.splice(incorrectEntries.indexOf(user), 1);
					}

					incorrectEntries.push(user);
				}
			}

			else if (buttonClicked === "D" ) {
				if (corAnsNum === 3){

					if (correctEntries.indexOf(user) > -1) {
						correctEntries.splice(correctEntries.indexOf(user), 1);
					}
					if (incorrectEntries.indexOf(user) > -1) {
						incorrectEntries.splice(incorrectEntries.indexOf(user), 1);
					}

					correctEntries.push(user);
				}
				else {
					
					if (correctEntries.indexOf(user) > -1) {
						correctEntries.splice(correctEntries.indexOf(user), 1);
					}
					if (incorrectEntries.indexOf(user) > -1) {
						incorrectEntries.splice(incorrectEntries.indexOf(user), 1);
					}

					incorrectEntries.push(user);
				}
			}
		
			await i.deferUpdate();
		});

		collector.on('end', async i => {
			console.log("Ended Trivia Message");

			console.log(correctEntries, incorrectEntries)

			
			interaction.channel.send(
				{  content: `The correct answer is: ${correct_answer}\nCongratulations to: ${correctEntries}\nBetter luck next time: ${incorrectEntries}`,
			});
		});
	}
};

function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
  
	// While there remain elements to shuffle...
	while (currentIndex != 0) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex--;
  
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
  
	return array;
  }