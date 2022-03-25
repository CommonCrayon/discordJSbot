const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var Rcon = require('rcon');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rcon')
		.setDescription('Send a command to the Server')
        .addStringOption(option => option.setName('command').setDescription('Enter a Rcon Command').setRequired(true)),


	async execute(interaction) {

        // GETTING ADMIN LIST
		// open the database
		let db = new sqlite3.Database('./commands/database/admins.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
              console.error(err.message);
            }
            console.log('Connected to the database.');
        });
  
  
        // Getting all the rows in the database
        function getData() {
            return new Promise((resolve, reject) => {
                db.all(`SELECT userid as id FROM admins`, (err, row) => {
                    if (err) { reject(err); }
                    resolve(row);
                });
            })
        }
  
        const data = await getData();

        function getAdmins(data) {
            return new Promise((resolve) => {
                var admin = [];
                for (const item of data) {
                    admin.push(item.id)
                }
                resolve(admin);
            })
        }
  
        const admin = await getAdmins(data);
          
        db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close the database connection.');
        });
        
        
        if (admin.includes(interaction.user.id)) {
            command = interaction.options.getString('command');

            const fs = require('fs')

            const serverIP = fs.readFileSync('commands/serverinfo/serverinfo.txt', 'utf8')
            const serverPW = fs.readFileSync('commands/serverinfo/serverpw.txt', 'utf8')

            var conn = new Rcon(serverIP, 27015, serverPW);
            
            conn.on('auth', function() {
    
                console.log("Authenticated");
                console.log("Sending command: " + command)
    
                conn.send(command);
                }).on('response', function(str) {
                console.log("Response: " + str); // HOW TO GET STR RESPONSE
                }).on('error', function(err) {
                console.log("Error: " + err);
                }).on('end', function() {
                console.log("Connection closed");
            });
    
            conn.connect();
    
    
            // Embed 
            var rconEmbed = new MessageEmbed()
                .setColor('0xFF6F00')
                .setTitle('Successfully sent command: ' + command)
                .setDescription('RESPONSE WILL BE ADDED')

            await interaction.reply(
                { embeds: [rconEmbed],
            })
        
        } else {
            // Missing Perms 
            var deniedEmbed = new MessageEmbed()
                .setColor('0xFF6F00')
                .setTitle('Permission Denied')
                .setDescription('Must be an Admin')

            await interaction.reply(
                {
                embeds: [deniedEmbed], 
                ephemeral: true 
            })
        }
	},
};

