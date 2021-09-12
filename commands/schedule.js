const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Schedules 10man!')
		.addStringOption(option => option.setName('time').setDescription('Enter a Time').setRequired(true)),


	async execute(interaction) {

		timeScheduled = interaction.options.getString('time');

		var [countdownHour, countdownMinute] = getCountdown(timeScheduled);

		// Embed 
		const mainEmbed = new MessageEmbed()
			.setThumbnail('https://imgur.com/vUG7MDU.png')
			.setColor('0xFF6F00')
			.setTitle('10 Man')
			.setURL('https://10man.commoncrayon.com/')
			.setDescription('Join a 10 Man!')
			.addFields(
				{ name: 'Time:', value: timeScheduled + " CEST"},
				{ name: 'Countdown:', value: countdownHour + ":" + countdownMinute },
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
			{ content: '<@&843565546004021297>', 
			embeds: [mainEmbed], 
			components: [buttons],
		}); 
	},
};


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

    return [countdownHour, countdownMinute];
}


