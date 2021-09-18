const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { decode } = require('html-entities');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Play a Trivia Question!'),

	async execute(interaction) {

		const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple', {
			headers: {
				'Test-Header': 'test-value'
			}
			});
			
		const info = (res.data.results[0]);

		var category = decode(info.category);
		var difficulty = decode(info.difficulty);
		var question = decode(info.question);
		var correct_answer = decode(info.correct_answer);
		var incorrect_answers = decode(info.incorrect_answers);

		incorrect_answers.push(correct_answer);
		shuffle(incorrect_answers);

		for (var i = 0; i < incorrect_answers.length; i++) {
			if (correct_answer === incorrect_answers[i]){
				corAnsNum = i
			}
		}
		
		// Embed 
		const triviaEmbed = new MessageEmbed()
			.setThumbnail('https://i.imgur.com/cuhu5P2.png')
			.setColor('0xFF6F00')
			.setTitle(category)
			.setDescription(question)
			.setFooter(`Difficulty: ${difficulty}`, 'https://i.imgur.com/nuEpvJd.png');

		
		// Buttons
		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('A')
					.setLabel(incorrect_answers[0])
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('B')
					.setLabel(incorrect_answers[1])
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('C')
					.setLabel(incorrect_answers[2])
					.setStyle('PRIMARY'),

				new MessageButton()
					.setCustomId('D')
					.setLabel(incorrect_answers[3])
					.setStyle('PRIMARY'),
			);

		await interaction.reply({  
				embeds: [triviaEmbed], 
				components: [buttons]
			}) 
		
		const collector = interaction.channel.createMessageComponentCollector({ time: 15000 }); //time: 15 seconds

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