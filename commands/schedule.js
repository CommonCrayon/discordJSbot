const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Schedules 10man!')
		.addStringOption(option => option.setName('time').setDescription('Enter a Time').setRequired(true)),


	async execute(interaction) {

		const yesEntry = [];
		const maybeEntry = [];
		const noEntry = [];

		timeScheduled = interaction.options.getString('time');

		var [countdownHour, countdownMinute, totalMinutes] = getCountdown(timeScheduled);

		// Embed 
		const mainEmbed = new MessageEmbed()
			.setThumbnail('https://imgur.com/vUG7MDU.png')
			.setColor('0xFF6F00')
			.setTitle('10 Man')
			.setURL('https://10man.commoncrayon.com/')
			.setDescription('Join a 10 Man!')
			.addFields(
				{ name: 'Time:', value: timeScheduled + " CEST"},
				{ name: 'Countdown:', value: `Starting in ${countdownHour}H ${countdownMinute}M`},
				{ name: 'Yes:', value: 'Empty' , inline: true},
				{ name: 'Maybe:', value: 'Empty', inline: true },
				{ name: 'No:', value: 'Empty', inline: true },
				)
			.setFooter('connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png');

		
		// Buttons
		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('yes')
					.setLabel('Yes')
					.setStyle('SUCCESS')
					.setEmoji('👍'),

				new MessageButton()
					.setCustomId('maybe')
					.setLabel('Maybe')
					.setStyle('PRIMARY')
					.setEmoji('🤷'),

				new MessageButton()
					.setCustomId('no')
					.setLabel('No')
					.setStyle('DANGER')
					.setEmoji('👎'),
			);

		await interaction.reply(
			{ content: "<@&843565546004021297>", 
			embeds: [mainEmbed], 
			components: [buttons],
		})
		
		console.log(`Schedule triggered by ${interaction.user.tag} in #${interaction.channel.name}.`);

		timeScheduled = interaction.options.getString('time');	//Getting String for timeScheduled posted in Time embed.

		var interactionTimeout = ((30 + totalMinutes)*60*1000)	// 30 Minutes + Minutes of the countdown * 60 to make into seconds * 1000 to make it into miliseconds

		const collector = interaction.channel.createMessageComponentCollector({ time: interactionTimeout }); 

		collector.on('collect', async i => {
		
			user = (`<@${i.user.id}>`);
			buttonClicked = (i.customId);
			console.log(`Schedule Button Clicked:\n   User: ${user}\n   ButtonClicked: ${buttonClicked}`);

			user = assignPriority(user);

			if (buttonClicked === "yes" ) {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry.splice(yesEntry.indexOf(user), 1);
				}

				if (maybeEntry.indexOf(user) > -1) {
					maybeEntry.splice(maybeEntry.indexOf(user), 1);
				}

				if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
				}

				//get array size
				
				yesEntry.push(user);

				let [yesString, maybeString, noString] = createString(yesEntry, maybeEntry, noEntry); //array size
				let mainEmbed = createEmbed(yesString, maybeString, noString, timeScheduled, yesEntry, maybeEntry, noEntry); 
				let buttons = createButton(); 
				
				await i.editReply({content: "<@&843565546004021297>", 
					embeds: [mainEmbed], 
					components: [buttons],
				});
			}

			else if (buttonClicked === "maybe" ) {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry.splice(yesEntry.indexOf(user), 1);
				}

				if (maybeEntry.indexOf(user) > -1) {
					maybeEntry.splice(maybeEntry.indexOf(user), 1);
				}

				if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
				}

				maybeEntry.push(user);

				let [yesString, maybeString, noString] = createString(yesEntry, maybeEntry, noEntry);
				let mainEmbed = createEmbed(yesString, maybeString, noString, timeScheduled, yesEntry, maybeEntry, noEntry); 
				let buttons = createButton(); 
				
				await i.editReply({content: "<@&843565546004021297>", 
					embeds: [mainEmbed], 
					components: [buttons],
				});
			}

			else if (buttonClicked === "no") {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry.splice(yesEntry.indexOf(user), 1);
				}

				if (maybeEntry.indexOf(user) > -1) {
					maybeEntry.splice(maybeEntry.indexOf(user), 1);
				}

				if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
				}

				noEntry.push(user);

				let [yesString, maybeString, noString] = createString(yesEntry, maybeEntry, noEntry);
				let mainEmbed = createEmbed(yesString, maybeString, noString, timeScheduled, yesEntry, maybeEntry, noEntry); 
				let buttons = createButton(); 
				
				await i.editReply({content: "<@&843565546004021297>", 
					embeds: [mainEmbed], 
					components: [buttons],
				});
			}
		});; 
	},
};


function createEmbed(yesString, maybeString, noString, timeScheduled, yesEntry, maybeEntry, noEntry) {

	let [countdownHour, countdownMinute, totalMinutes] = getCountdown(timeScheduled);

	const mainEmbed = new MessageEmbed()
	.setColor('0xFF6F00')
	.setTitle('10 Man')
	.setURL('https://10man.commoncrayon.com/')
	.setDescription('Join a 10 Man!')
	.addFields(
		{ name: 'Time:', value: timeScheduled + " CEST" },
		{ name: 'Countdown:', value: countdownHour + ":" + countdownMinute},
		{ name: `Yes(${yesEntry.length}):`, value: yesString, inline: true},	//add array sizes
		{ name: `Maybe(${maybeEntry.length}):`, value: maybeString, inline: true },
		{ name: `No(${noEntry.length}):`, value: noString, inline: true },
		)
	.setFooter('Server IP: connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png');
	return mainEmbed;
}


function createButton() {

	const buttons = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('yes')
				.setLabel('Yes')
				.setStyle('SUCCESS')
				.setEmoji('👍'),

			new MessageButton()
			.setCustomId('maybe')
			.setLabel('Maybe')
			.setStyle('PRIMARY')
			.setEmoji('🤷'),

			new MessageButton()
			.setCustomId('no')
			.setLabel('No')
			.setStyle('DANGER')
			.setEmoji('👎'),
		);
	return buttons;
}


function createString(yesEntry, maybeEntry, noEntry) {
	// For Yes
	if (yesEntry.length == 0){
		yesString = "Empty";
	}
	else {
		yesString = "";
		for (var l = 0; l < yesEntry.length; l++) {
			yesString = (yesString + yesEntry[l] + '\n');
		}
	}

	// For Maybe
	if (maybeEntry.length == 0){
		maybeString = "Empty";
	}
	else {
		maybeString = "";
		for (var l = 0; l < maybeEntry.length; l++) {
			maybeString = (maybeString + maybeEntry[l] + '\n');
		}
	}

	// For No
	if (noEntry.length == 0){
		noString = "Empty";
	}
	else {
		noString = "";
		for (var l = 0; l < noEntry.length; l++) {
			noString = (noString + noEntry[l] + '\n');
		}
	}

	return [yesString, maybeString, noString];
}


function getCountdown(timeScheduled) {
    const scheduledTimeArray = timeScheduled.split(":");

    var d = new Date();
    var cetHour = d.getUTCHours()+2;  //CHANGE FOR CET/CEST
    var cetMinute = d.getUTCMinutes();
    
    var cetTime = (cetHour*60 + cetMinute);
    
    var integerUTCHour = parseInt(scheduledTimeArray[0], 10);
    var integerUTCMin = parseInt(scheduledTimeArray[1], 10);
    var integerCET = parseInt(cetTime, 10);
    
    scheduledMinutes = (integerUTCHour*60 + integerUTCMin);
    
    totalMinutes = (scheduledMinutes - integerCET);
    
    
    countdownHour = Math.floor(totalMinutes / 60);
    countdownMinute = (totalMinutes - countdownHour*60);

    return [countdownHour, countdownMinute, totalMinutes];
}


function assignPriority(user) {
	const priority = [
		"<@210366732735479808>", // Roald
		"<@207594599739424768>", // Linkin
		"<@492040137765814272>", // Mr.Queen
		"<@148237004830670848>", // Dashtay
		"<@532310325911879690>", // RoyalBacon
		"<@277360174371438592>", // CommonCrayon
		"<@114714586799800323>", // Thisted
	]; 

	for (var i = 0; i < priority.length; i++) {
		if (user === priority[i]){
			user = "🔴" + user;
		}
	}
	return user;
}

