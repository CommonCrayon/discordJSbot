const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
//const fetch = require('node-fetch')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trivia')
		.setDescription('Play a Trivia Question!'),

	async execute(interaction) {

		/*
		fetch('https://opentdb.com/api.php?amount=1&type=multiple')
			.then(response => response.json())
			.then(data => console.log(data));
		*/

		var category = "Science & Nature";
		var difficulty = "easy";
		var question = "This element, when overcome with extreme heat and pressure, creates diamonds.";
		var correct_answer = "Carbon";
		var incorrect_answers = ["Nitrogen","Oxygen","Hydrogen"]

		incorrect_answers.push(correct_answer);
		shuffle(incorrect_answers);
		
		// Embed 
		const triviaEmbed = new MessageEmbed()
			.setThumbnail('https://i.imgur.com/cuhu5P2.png')
			.setColor('0xFF6F00')
			.setTitle(category)
			.setDescription(question)
			.addFields(
				{ name: 'A', value: incorrect_answers[0]},
				{ name: 'B', value: incorrect_answers[1]},
				{ name: 'C', value: incorrect_answers[2]},
				{ name: 'D', value: incorrect_answers[3]},
				)
			.setFooter(`Difficulty: ${difficulty}`, 'https://i.imgur.com/nuEpvJd.png');

		
		// Buttons
		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('A')
					.setLabel('A')
					.setStyle('PRIMARY'),
					//.setEmoji('🇦'),

				new MessageButton()
					.setCustomId('B')
					.setLabel('B')
					.setStyle('PRIMARY'),
					//.setEmoji('🇧'),

				new MessageButton()
					.setCustomId('C')
					.setLabel('C')
					.setStyle('PRIMARY'),
					//.setEmoji('🇨'),

				new MessageButton()
					.setCustomId('D')
					.setLabel('D')
					.setStyle('PRIMARY'),
					//.setEmoji('🇩'),
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