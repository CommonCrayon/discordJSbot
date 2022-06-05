const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Purpose and List of Commands'),


	async execute(interaction) {

        // Embed 
        var helpEmbed = new MessageEmbed()
            .setColor('0xFF6F00')
            .setTitle('BotCrayon')
            .setDescription('I am used to help run the 10mans hosted by Maps Of No Trades.\nI also have a few fun commands!')
            .addFields(
                { name: '\u200B', value: '**User Commands**' },
                { name: '/help', value: 'Displays This!' },
                { name: '/5man', value: 'Run a 5 Man Queue! (2.5 Hours)' },
                { name: '/trivia', value: 'Play a Trivia Question!\n' },

                { name: '/subscribe', value: 'Subscribe to get notified by the Scheduler!' },
                { name: '/unsubscribe', value: 'Unsubscribe to not get notified by the Scheduler!' },


                { name: '\u200B', value: '**Admin Commands**' },
                { name: '/schedule', value: 'Schedules a 10 Man\n' },

                { name: '/start', value: 'Start a 10 Man Game' },
                { name: '/map', value: 'Change Map on the 10 Man Server' },
                { name: '/rcon', value: 'Send a Commands to the 10 Man Server' },
                { name: '/awplimit', value: 'Sets AWP limit on the Server' },
                { name: '/wingman', value: 'Starts a Wingman Game\n' },

                { name: '/pool', value: 'Displays the Map Pool' },
                { name: '/addmap', value: 'Adds a Map to the Map Pool' },
                { name: '/removemap', value: 'Removes a Map to the Map Pool' },
                { name: '/votemap', value: 'Vote on 5 Random Maps' },
                { name: '/spinmap', value: 'Gets One Random Map' },
            )
            .setFooter({ text: 'Made By CommonCrayon', iconURL: 'https://imgur.com/a/P0Ef644' })
            .setTimestamp();

        await interaction.reply({ embeds: [helpEmbed] })
	},
};

