const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


const yesEntry = [];
const maybeEntry = [];
const noEntry = [];
var x = 0;	// Counter For yesEntry
var y = 0;	// Counter For maybeEntry
var z = 0;	// Counter For noEntry


module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);

		user = (`${interaction.user}`)	// Captures user's name

		const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i => {

            if (i.customId.includes("yes") ) {
				await i.deferUpdate();

				yesEntry.push(user);

				//NEEDS TO BE A FUNCTION================================
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
				//NEEDS TO BE A FUNCTION================================

				let mainEmbed = createEmbed(yesString, maybeString, noString); 
				let buttons = createButton(); 
				
				await i.editReply({content: '@10-man', 
					embeds: [mainEmbed], 
					components: [buttons],
				});
            }

            else if (i.customId.includes("maybe") ) {
				await i.deferUpdate();

				maybeEntry.push(user);

				//NEEDS TO BE A FUNCTION================================
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
				//NEEDS TO BE A FUNCTION================================

				let mainEmbed = createEmbed(yesString, maybeString, noString); 
				let buttons = createButton(); 
				
				await i.editReply({content: '@10-man', 
					embeds: [mainEmbed], 
					components: [buttons],
				});
            }

            else if (i.customId.includes("no") ) {
				await i.deferUpdate();

				noEntry.push(user);

				//NEEDS TO BE A FUNCTION================================
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
				//NEEDS TO BE A FUNCTION================================

				let mainEmbed = createEmbed(yesString, maybeString, noString); 
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
	//.setThumbnail('https://imgur.com/vUG7MDU.png')
	.setColor('0xFF6F00')
	.setTitle('10 Man')
	.setURL('https://10man.commoncrayon.com/')
	.setDescription('Join a 10 Man!')
	.addFields(
		{ name: 'Time:', value: '20:30' },
		{ name: 'Countdown:', value: 'number' },
		{ name: 'Yes: ', value: yesEntry, inline: true},
		{ name: 'Maybe: ', value: maybeEntry, inline: true },
		{ name: 'No: ', value: noEntry, inline: true },
		)
	.setFooter('Server IP: connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png');
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