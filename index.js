const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	// 10 Man Schedule Command
	if (interaction.commandName === 'schedule') {

		// Embed 
		const mainEmbed = new MessageEmbed()
			.setThumbnail('https://imgur.com/vUG7MDU.png')
			.setColor('0xFF6F00')
			.setTitle('10 Man')
			.setURL('https://10man.commoncrayon.com/')
			.setDescription('Join a 10 Man!')
			.addFields(
				{ name: 'Time:', value: '20:30' },
				{ name: 'Countdown:', value: 'number' })
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


	
	
	// Start Time Change Vote
	} else if (interaction.commandName === 'vote') {
		// Embed 
		const mainEmbed = new MessageEmbed()
			.setThumbnail('https://imgur.com/vUG7MDU.png')
			.setColor('0xFF6F00')
			.setTitle('Change 10-Man Time Vote:')
			.setDescription('Vote from the dropdown')
			.addFields(
				{ name: '20:00:', value: '1' },
				{ name: '20:30:', value: '1' },
				{ name: '21:00:', value: '1' },
				{ name: '21:30:', value: '1' },
				{ name: '22:00:', value: '1' })
			.setFooter('Made By CommonCrayon', 'https://i.imgur.com/nuEpvJd.png');

		// dropdowns
		const dropdown = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{label: '20:00', value: 'first_option'},
						{label: '20:30', value: 'second_option'},
						{label: '21:00', value: 'third_option'},
						{label: '21:30', value: 'fourth_option'},
						{label: '22:00', value: 'fifth_option'},
					]),
			);


		await interaction.reply({ embeds: [mainEmbed], components: [dropdown],}); 

	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);

	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});



client.login(token);