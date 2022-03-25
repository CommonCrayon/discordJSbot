const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
var Rcon = require('rcon');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start a 10 Man Game'),


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
            
            const fs = require('fs')

            const serverIP = fs.readFileSync('commands/serverinfo/serverinfo.txt', 'utf8')
            const serverPW = fs.readFileSync('commands/serverinfo/serverpw.txt', 'utf8')

            var conn = new Rcon(serverIP, 27015, serverPW);

            conn.on('auth', function() {
                console.log("Authenticated");
                console.log("Sending command: mp_warmup_end")
                
                conn.send("mp_warmup_end");

                }).on('response', function(str) {
                console.log("Response: " + str);

                }).on('error', function(err) {
                console.log("Error: " + err);

                }).on('end', function() {
                console.log("Connection closed");
            });

            conn.connect();

            
            // Embed 
            var startEmbed = new MessageEmbed()
                .setColor('0xFF6F00')
                .setTitle('Warmup Ended')

            await interaction.reply(
                { embeds: [startEmbed],
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

