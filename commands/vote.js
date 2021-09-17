const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

var option1 = ('\u200b');
var option2 = ('\u200b');
var option3 = ('\u200b');
var option4 = ('\u200b');
var option5 = ('\u200b');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vote')
		.setDescription('Starts Change Time Vote!')
		.addIntegerOption(option => option.setName('timeout').setDescription('Enter number of minutes for voting').setRequired(true))
		.addStringOption(option => option.setName('option1').setDescription('Enter Option 1').setRequired(true))
		.addStringOption(option => option.setName('option2').setDescription('Enter Option 2').setRequired(true))
		.addStringOption(option => option.setName('option3').setDescription('Enter Option 3'))
		.addStringOption(option => option.setName('option4').setDescription('Enter Option 4'))
		.addStringOption(option => option.setName('option5').setDescription('Enter Option 5')),
        

	async execute(interaction) {

		option1 = interaction.options.getString('option1');
		option2 = interaction.options.getString('option2');
		if (interaction.options.getString('option3') != null){
			option3 = interaction.options.getString('option3');
		}

		if (interaction.options.getString('option4') != null){
			option3 = interaction.options.getString('option4');
		}

		if (interaction.options.getString('option5') != null){
			option3 = interaction.options.getString('option5');
		}

		console.log(option1, option2, option3, option4, option5);

		// Embed 
		const mainEmbed = new MessageEmbed()
			.setColor('0xFF6F00')
			.setTitle('Change 10-Man Time Vote:')
			.setDescription('Vote from the dropdown')
			.addFields(
				{ name: option1, value: '\u200b' },
				{ name: option2, value: '\u200b' },
				{ name: option3, value: '\u200b' },
				{ name: option4, value: '\u200b' },
				{ name: option5, value: '\u200b' })
			.setFooter('Made By CommonCrayon', 'https://i.imgur.com/nuEpvJd.png');

		// dropdowns
		const dropdown = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{label: option1, value: 'first_option'},
						{label: option2, value: 'second_option'},
						{label: option3, value: 'third_option'},
						{label: option4, value: 'fourth_option'},
						{label: option5, value: 'fifth_option'},
					]),
			);


		await interaction.reply(
			{ 
			embeds: [mainEmbed], 
			components: [dropdown],
		})

		console.log(`Vote triggered by ${interaction.user.tag} in #${interaction.channel.name}.`);

		var firstOption = [];
		var secondOption = [];
		var thirdOption = [];
		var fourthOption = [];
		var fifthOption = [];

		const totalMinutes = interaction.options.getInteger('timeout');
		var interactionTimeout = (totalMinutes*60*1000);	// 30 Minutes + Minutes of the countdown * 60 to make into seconds * 1000 to make it into miliseconds

		const collector = interaction.channel.createMessageComponentCollector({ time: interactionTimeout }); 

		collector.on('collect', async i => {

			var optionSelected = (i.values);
			var user = (`<@${i.user.id}>`);

			console.log(`${user} selected ${optionSelected}`);

			if ((i.values) == 'first_option') {
				await i.deferUpdate();

				firstOption.push(user);
				let [firstString, secondString, thirdString, fourthString, fifthString] = createString(firstOption, secondOption, thirdOption, fourthOption, fifthOption);
				let mainEmbed = createEmbed(firstString, secondString, thirdString, fourthString, fifthString);

				await i.editReply({embeds: [mainEmbed]}) 
			}

			else if ((i.values) == 'second_option') {
				await i.deferUpdate();

				secondOption.push(user);
				let [firstString, secondString, thirdString, fourthString, fifthString] = createString(firstOption, secondOption, thirdOption, fourthOption, fifthOption);
				let mainEmbed = createEmbed(firstString, secondString, thirdString, fourthString, fifthString);

				await i.editReply({embeds: [mainEmbed]}) 
			}

			else if ((i.values) == 'third_option') {
				await i.deferUpdate();

				thirdOption.push(user);
				let [firstString, secondString, thirdString, fourthString, fifthString] = createString(firstOption, secondOption, thirdOption, fourthOption, fifthOption);
				let mainEmbed = createEmbed(firstString, secondString, thirdString, fourthString, fifthString);

				await i.editReply({embeds: [mainEmbed]}) 
			}

			else if ((i.values) == 'fourth_option') {
				await i.deferUpdate();

				fourthOption.push(user);
				let [firstString, secondString, thirdString, fourthString, fifthString] = createString(firstOption, secondOption, thirdOption, fourthOption, fifthOption);
				let mainEmbed = createEmbed(firstString, secondString, thirdString, fourthString, fifthString);

				await i.editReply({embeds: [mainEmbed]}) 
			}

			else if ((i.values) == 'fifth_option') {
				await i.deferUpdate();

				fifthOption.push(user);
				let [firstString, secondString, thirdString, fourthString, fifthString] = createString(firstOption, secondOption, thirdOption, fourthOption, fifthOption);
				let mainEmbed = createEmbed(firstString, secondString, thirdString, fourthString, fifthString);

				await i.editReply({embeds: [mainEmbed]}) 
			}
		});

		collector.on('end', async i => {
			console.log("Ended Vote");
		});
	}

};


function createEmbed(firstOption, secondOption, thirdOption, fourthOption, fifthOption) {

	const mainEmbed = new MessageEmbed()
	.setThumbnail('https://imgur.com/vUG7MDU.png')
	.setColor('0xFF6F00')
	.setTitle('Change 10-Man Time Vote:')
	.setDescription('Vote from the dropdown')
	.addFields(
		{ name: option1, value: firstOption },
		{ name: option2, value: secondOption },
		{ name: option3, value: thirdOption },
		{ name: option4, value: fourthOption },
		{ name: option5, value: fifthOption })
	.setFooter('Made By CommonCrayon', 'https://i.imgur.com/nuEpvJd.png');
	return mainEmbed;
}


function createString(firstOption, secondOption, thirdOption, fourthOption, fifthOption) {
	if (firstOption.length == 0){
		firstString = '\u200b';
	}
	else {
		firstString = "";
		for (var l = 0; l < firstOption.length; l++) {
			firstString = (firstString + firstOption[l] + ' ');
		}
	}

	if (secondOption.length == 0){
		secondString = '\u200b';
	}
	else {
		secondString = "";
		for (var l = 0; l < secondOption.length; l++) {
			secondString = (secondString + secondOption[l] + ' ');
		}
	}

	if (thirdOption.length == 0){
		thirdString = '\u200b';
	}
	else {
		thirdString = "";
		for (var l = 0; l < thirdOption.length; l++) {
			thirdString = (thirdString + thirdOption[l] + ' ');
		}
	}

	if (fourthOption.length == 0){
		fourthString = '\u200b';
	}
	else {
		fourthString = "";
		for (var l = 0; l < fourthOption.length; l++) {
			fourthString = (fourthString + fourthOption[l] + ' ');
		}
	}

	if (fifthOption.length == 0){
		fifthString = '\u200b';
	}
	else {
		fifthString = "";
		for (var l = 0; l < fifthOption.length; l++) {
			fifthString = (fifthString + fifthOption[l] + ' ');
		}
	}

	return [firstString, secondString, thirdString, fourthString, fifthString];
}
