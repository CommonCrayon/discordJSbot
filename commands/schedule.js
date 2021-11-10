const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Schedules 10man!')
		.addStringOption(option => option.setName('time').setDescription('Enter a Time').setRequired(true)),


	async execute(interaction) {
		
		var yesEntry = [];
		var maybeEntry = [];
		var noEntry = [];

		timeScheduled = interaction.options.getString('time');

		var [countdownHour, countdownMinute, totalMinutes] = getCountdown(timeScheduled);

		// Embed 
		var mainEmbed = new MessageEmbed()
			.setThumbnail('https://imgur.com/vUG7MDU.png')
			.setColor('0xFF6F00')
			.setTitle('10 Man')
			.setURL('https://10man.commoncrayon.com/')
			.setDescription('Join a 10 Man!')
			.addFields(
				{ name: 'Time:', value: timeScheduled + " CET"},
				{ name: '🔄 Countdown:', value: `Starting in ${countdownHour}H ${countdownMinute}M`},
				{ name: 'Yes:', value: 'Empty' , inline: true},
				{ name: 'Maybe:', value: 'Empty', inline: true },
				{ name: 'No:', value: 'Empty', inline: true },
				)
			.setFooter('Server IP: connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png');

		
		// Buttons
		var buttons = new MessageActionRow()
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

				new MessageButton()
					.setCustomId('update')
					.setStyle('SECONDARY')
					.setEmoji('🔄'),
			);

		await interaction.reply(
			{ content: "@everyone", 
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

				yesEntry.push(user);


				let [yesString, maybeString, noString] = createString(yesEntry, maybeEntry, noEntry); //array size
				let mainEmbed = createEmbed(yesString, maybeString, noString, timeScheduled, yesEntry, maybeEntry, noEntry); 
				let buttons = createButton(); 
				
				await i.editReply({content: "@everyone", 
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
				
				await i.editReply({content: "@everyone", 
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
				
				await i.editReply({content: "@everyone", 
					embeds: [mainEmbed], 
					components: [buttons],
				});
			}

			else if (buttonClicked === "update") {
				await i.deferUpdate();

				let [yesString, maybeString, noString] = createString(yesEntry, maybeEntry, noEntry);
				let mainEmbed = createEmbed(yesString, maybeString, noString, timeScheduled, yesEntry, maybeEntry, noEntry); 
				let buttons = createButton(); 
				
				await i.editReply({content: "@everyone", 
					embeds: [mainEmbed], 
					components: [buttons],
				});
			}
		});;


		// 30 Minutes after Scheduled time has passed.
		collector.on('end', async i => {
			console.log("Ended Schedule Message");

			var buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('yes')
					.setLabel('Yes')
					.setStyle('SUCCESS')
					.setEmoji('👍')
					.setDisabled(true),

				new MessageButton()
					.setCustomId('maybe')
					.setLabel('Maybe')
					.setStyle('PRIMARY')
					.setEmoji('🤷')
					.setDisabled(true),

				new MessageButton()
					.setCustomId('no')
					.setLabel('No')
					.setStyle('DANGER')
					.setEmoji('👎')
					.setDisabled(true),
			);

			await interaction.editReply({
				components: [buttons]
			});
		});
	},
};


function createEmbed(yesString, maybeString, noString, timeScheduled, yesEntry, maybeEntry, noEntry) {

	let [countdownHour, countdownMinute, totalMinutes] = getCountdown(timeScheduled);

	if (totalMinutes > 0) {
		var countdownOutput = (`Starting in ${countdownHour}H ${countdownMinute}M`);
	}
	else {
		var countdownOutput = (`Started!`);
	}

	var mainEmbed = new MessageEmbed()
	.setColor('0xFF6F00')
	.setTitle('10 Man')
	.setURL('https://10man.commoncrayon.com/')
	.setDescription('Join a 10 Man!')
	.addFields(
		{ name: 'Time:', value: timeScheduled + " CET" },
		{ name: '🔄 Countdown:', value: countdownOutput},
		{ name: `Yes(${yesEntry.length}):`, value: yesString, inline: true},
		{ name: `Maybe(${maybeEntry.length}):`, value: maybeString, inline: true },
		{ name: `No(${noEntry.length}):`, value: noString, inline: true },
		)
	.setFooter('Server IP: connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png')
	return mainEmbed;
}


function createButton() {

	var buttons = new MessageActionRow()
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

			new MessageButton()
				.setCustomId('update')
				.setStyle('SECONDARY')
				.setEmoji('🔄'),
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
    var cetHour = d.getUTCHours()+1;  //CHANGE FOR CET/CEST
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
		"<@431743926974808076>", // k0vac
		"<@285367857934630912>", // Amajha
		"<@216678626182168577>", // Cajeb
		"<@224909663689244673>", // Shadow
		"<@277360174371438592>", // CommonCrayon
		"<@114714586799800323>", // Thisted
	]; 

	for (var i = 0; i < priority.length; i++) {
		if (user === priority[i]){
			user = "🎗️" + user;
		}
	}
	return user;
}