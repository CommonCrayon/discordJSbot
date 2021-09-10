const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Schedules 10man!'),
			


	async execute(interaction) {
		// Embed 
		const mainEmbed = new MessageEmbed()
			.setThumbnail('https://imgur.com/vUG7MDU.png')
			.setColor('0xFF6F00')
			.setTitle('10 Man')
			.setURL('https://10man.commoncrayon.com/')
			.setDescription('Join a 10 Man!')
			.addFields(
				{ name: 'Time:', value: '20:30' },
				{ name: 'Countdown:', value: 'number' },
                { name: 'Yes: (0)', value: 'None' , inline: true},
                { name: 'Maybe: (0)', value: 'None', inline: true },
                { name: 'No: (0)', value: 'None', inline: true },
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
			{ content: '@10-man', 
			embeds: [mainEmbed], 
			components: [buttons],
		}); 
	},
};




