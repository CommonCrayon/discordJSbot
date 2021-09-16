const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Play a Trivia Question!'),

	async execute(interaction) {

		/*
		axios.get('https://opentdb.com/api.php?amount=1&type=multiple')
			.then((response) => {
				console.log('Response: ', response.data)
			})
			.catch((error) => {
				console.error('Error: ', error)
			})
		*/

		const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple', {
			headers: {
				'Test-Header': 'test-value'
			}
			});
			
		const info = (res.data.results[0]);

		var category = (info.category);
		var difficulty = (info.difficulty);
		var question = (info.question);
		var correct_answer = (info.correct_answer);
		var incorrect_answers = (info.incorrect_answers);

		writeTextFile('correctAnswer.txt', correct_answer);

		incorrect_answers.push(correct_answer);
		shuffle(incorrect_answers);
		
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

		await interaction.reply(
			{  
				embeds: [triviaEmbed], 
				components: [buttons]
			}) 
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

  function writeTextFile(afilename, output)
  {
	var txtFile =new File(afilename);
	txtFile.writeln(output);
	txtFile.close();
  }