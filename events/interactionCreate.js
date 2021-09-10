const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const yesEntry = ['Empty'];
const maybeEntry = ['Empty'];
const noEntry = ['Empty'];

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);


		const mainEmbed = new MessageEmbed()
			.setThumbnail('https://imgur.com/vUG7MDU.png')
			.setColor('0xFF6F00')
			.setTitle('10 Man')
			.setURL('https://10man.commoncrayon.com/')
			.setDescription('Join a 10 Man!')
			.addFields(
				{ name: 'Time:', value: '20:30' },
				{ name: 'Countdown:', value: 'number' },
                { name: 'Yes: (0)', value: ' ' + yesEntry, inline: true},
                { name: 'Maybe: (0)', value: ' ' + maybeEntry, inline: true },
                { name: 'No: (0)', value: ' ' + noEntry, inline: true },
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



		const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'yes') {
				await i.deferUpdate();
				yesEntry.push(`${interaction.user.tag}`); // Append to List
				const mainEmbed = new MessageEmbed()
					.setThumbnail('https://imgur.com/vUG7MDU.png')
					.setColor('0xFF6F00')
					.setTitle('10 Man')
					.setURL('https://10man.commoncrayon.com/')
					.setDescription('Join a 10 Man!')
					.addFields(
						{ name: 'Time:', value: '20:30' },
						{ name: 'Countdown:', value: 'number' },
						{ name: 'Yes: (0)', value: ' ' + yesEntry, inline: true},
						{ name: 'Maybe: (0)', value: ' ' + maybeEntry, inline: true },
						{ name: 'No: (0)', value: ' ' + noEntry, inline: true },
						)
					.setFooter('connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png');

				await i.editReply({content: '@10-man', 
					embeds: [mainEmbed], 
					components: [buttons],
				});
            }

            if (i.customId === 'maybe') {
				await i.deferUpdate();
				maybeEntry.push(`${interaction.user.tag}`);
				
				const mainEmbed = new MessageEmbed()
					.setThumbnail('https://imgur.com/vUG7MDU.png')
					.setColor('0xFF6F00')
					.setTitle('10 Man')
					.setURL('https://10man.commoncrayon.com/')
					.setDescription('Join a 10 Man!')
					.addFields(
						{ name: 'Time:', value: '20:30' },
						{ name: 'Countdown:', value: 'number' },
						{ name: 'Yes: (0)', value: ' ' + yesEntry, inline: true},
						{ name: 'Maybe: (0)', value: ' ' + maybeEntry, inline: true },
						{ name: 'No: (0)', value: ' ' + noEntry, inline: true },
						)
					.setFooter('connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png');
				
				await i.editReply({content: '@10-man', 
					embeds: [mainEmbed], 
					components: [buttons],
				});
            }

            if (i.customId === 'no') {
				await i.deferUpdate();
				noEntry.push(`${interaction.user.tag}`);

				const mainEmbed = new MessageEmbed()
					.setThumbnail('https://imgur.com/vUG7MDU.png')
					.setColor('0xFF6F00')
					.setTitle('10 Man')
					.setURL('https://10man.commoncrayon.com/')
					.setDescription('Join a 10 Man!')
					.addFields(
						{ name: 'Time:', value: '20:30' },
						{ name: 'Countdown:', value: 'number' },
						{ name: 'Yes: (0)', value: ' ' + yesEntry, inline: true},
						{ name: 'Maybe: (0)', value: ' ' + maybeEntry, inline: true },
						{ name: 'No: (0)', value: ' ' + noEntry, inline: true },
						)
					.setFooter('connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png');
					
				await i.editReply({content: '@10-man', 
					embeds: [mainEmbed], 
					components: [buttons],
				});
            }
        });
        
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};

