const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Schedules 10man!')
		.addNumberOption(option => option.setName('num').setDescription('Enter a number').setRequired(true)),


	async execute(interaction) {
	
		// Embed 
		const mainEmbed = new MessageEmbed()
			.setThumbnail('https://imgur.com/vUG7MDU.png')
			.setColor('0xFF6F00')
			.setTitle('10 Man')
			.setURL('https://10man.commoncrayon.com/')
			.setDescription('Join a 10 Man!')
			.addFields(
				{ name: 'Time:', value: interaction.options.getNumber('num')},
				{ name: 'Countdown:', value: 'number' },
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




