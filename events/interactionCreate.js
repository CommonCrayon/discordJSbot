const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


const yesEntry = ['-'];
const maybeEntry = ['-'];
const noEntry = ['-'];
var x = 0;
var y = 0;
var z = 0;

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
		const userid = (`${interaction.user}`);

		console.log("Outside" + userid);


		const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i => {
			console.log("Inside" + userid);

            if (i.customId.includes("yes") ) {
				await i.deferUpdate();
				yesEntry.push(userid);
				theRemovedElement == 1
				var theRemovedElement = yesEntry.shift()


				let mainEmbed = createEmbed(yesEntry, maybeEntry, noEntry); 
				let buttons = createButton(); 
				
				await i.editReply({content: '@10-man', 
					embeds: [mainEmbed], 
					components: [buttons],
				});
            }

            else if (i.customId.includes("maybe") ) {
				await i.deferUpdate();
				maybeEntry.push(userid);
				theRemovedElement == 1
				var theRemovedElement = maybeEntry.shift()


				let mainEmbed = createEmbed(yesEntry, maybeEntry, noEntry); 
				let buttons = createButton(); 
				
				await i.editReply({content: '@10-man', 
					embeds: [mainEmbed], 
					components: [buttons],
				});
            }

            else if (i.customId.includes("no") ) {
				await i.deferUpdate();
				noEntry.push(userid);
				theRemovedElement == 1
				var theRemovedElement = noEntry.shift()


				let mainEmbed = createEmbed(yesEntry, maybeEntry, noEntry); 
				let buttons = createButton(); 
				
				await i.editReply({content: '@10-man', 
					embeds: [mainEmbed], 
					components: [buttons],
				});
            }
        });
        
        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
	},
};


function createEmbed(yesEntry, maybeEntry, noEntry) {
	const mainEmbed = new MessageEmbed()
	.setThumbnail('https://imgur.com/vUG7MDU.png')
	.setColor('0xFF6F00')
	.setTitle('10 Man')
	.setURL('https://10man.commoncrayon.com/')
	.setDescription('Join a 10 Man!')
	.addFields(
		{ name: 'Time:', value: '20:30' },
		{ name: 'Countdown:', value: 'number' },
		{ name: 'Yes: (' + yesEntry.length + ')', value: ' ' + yesEntry, inline: true},
		{ name: 'Maybe: (' + maybeEntry.length + ')', value: ' ' + maybeEntry, inline: true },
		{ name: 'No: (' + noEntry.length + ')', value: ' ' + noEntry, inline: true },
		)
	.setFooter('connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png');
	return mainEmbed;
}


function createButton() {

	var yesID = String("yes" + x++);
	var maybeID = String("maybe" + y++);
	var noID = String("no" + z++);

	const buttons = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(yesID)
				.setLabel('Yes')
				.setStyle('SUCCESS')
				.setEmoji('👍'),

			new MessageButton()
			.setCustomId(maybeID)
			.setLabel('Maybe')
			.setStyle('PRIMARY')
			.setEmoji('🤷'),

			new MessageButton()
			.setCustomId(noID)
			.setLabel('No')
			.setStyle('DANGER')
			.setEmoji('👎'),
		);
	return buttons;
}