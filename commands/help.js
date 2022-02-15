const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
var Rcon = require('rcon');

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
                { name: 'User Commands', value: '\u200B' },
                { name: '/help', value: 'Displays This!' },
                { name: '/trivia', value: 'Play a Trivia Question!' },
                { name: 'Admin Commands', value: '\u200B' },
                { name: '/start', value: 'Start a 10 Man Game' },
                { name: '/map', value: 'Change Map on 10 Man Server' },
                { name: '/rcon', value: 'Send a Commands to the 10 Man Server' },
                { name: '/schedule', value: 'Schedules a 10 Man' },
            )
            .setFooter({ text: 'Made By CommonCrayon', iconURL: 'https://imgur.com/a/P0Ef644' });

        await interaction.reply({ embeds: [helpEmbed] })
	},
};

