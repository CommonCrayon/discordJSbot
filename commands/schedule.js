const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Schedules 10man!')
		.addStringOption(option => option.setName('time').setDescription('Enter a Time (20:30)').setRequired(true)),


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


			// open the database
			let db = new sqlite3.Database('./commands/database/subscribers.db', sqlite3.OPEN_READWRITE, (err) => {
				if (err) {
				console.error(err.message);
				}
				console.log('Connected to the database.');
			});
	
	
			// Getting all the rows in the database
			function getData() {
				return new Promise((resolve, reject) => {
					db.all(`SELECT userid FROM subscriber`, (err, row) => {
						if (err) { reject(err); }
						resolve(row);
					});
				})
			}
	
			const data = await getData();
			
			mentionSubs = ' '
			data.forEach(element => {
				mentionSubs += ('<@' + element.userid + '> ');
			});


			db.close((err) => {
				if (err) {
				  console.error(err.message);
				}
				console.log('Close the database connection.');
			});
			
			var yesEntry = [];
			var noEntry = [];

			timeScheduled = interaction.options.getString('time');

			var [countdownHour, countdownMinute, totalMinutes, epochTime] = getCountdown(timeScheduled);


			// Embed 
			var mainEmbed = new MessageEmbed()
				.setColor('0xFF6F00')
				.setTitle('10 Man')
				.setURL('https://10man.commoncrayon.com/')
				.setDescription('Join a 10 Man!')
				.addFields(
					{ name: 'Time:', value: `<t:${epochTime}>`},
					{ name: 'Countdown:', value: `Starting in ${countdownHour}H ${countdownMinute}M`},
					{ name: '__Yes:__', value: 'Empty' , inline: true},
					{ name: '__No:__', value: 'Empty', inline: true },
					)
				.setFooter('Server IP: connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png');

			
			// Buttons
			var buttons = new MessageActionRow()
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
						.setEmoji('🔸'),

					new MessageButton()
						.setCustomId('no')
						.setLabel('No')
						.setStyle('DANGER')
						.setEmoji('👎'),
				);

			await interaction.reply(
				{
				content: mentionSubs,
				embeds: [mainEmbed], 
				components: [buttons]
			});


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
		
		console.log(`Schedule triggered by ${interaction.user.tag} in #${interaction.channel.name}.`);

		timeScheduled = interaction.options.getString('time');	//Getting String for timeScheduled posted in Time embed.

		const reply = await interaction.fetchReply()

		let doingUpdate = false;

		const doUpdate = async () => {
			if (doingUpdate)
			{// doing update, try again later
				setTimeout(doUpdate, 1000);
				console.log('Skipping update')
				return;
			}

			let [yesString, noString] = createString(yesEntry, noEntry); //array size
			let mainEmbed = createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry);
			let buttons = createButton();
			const [, , totalMinutes,] = getCountdown(timeScheduled)

			await reply.edit({
				embeds: [mainEmbed],
				components: [buttons],
			});

			if (totalMinutes >= 0) // stop updating when time 
				setTimeout(doUpdate, 60000);
			else
				console.log('Update stopped')
		}
		setTimeout(doUpdate, 60000);

		const totalMinutesNum = totalMinutes;
		const interactionTimeout = (30 + totalMinutesNum) * 60 * 1000;
		const collector = reply.createMessageComponentCollector({
			time: interactionTimeout,
		});

		collector.on('collect', async i => {
			
			user = (i.user.username);
			doingUpdate = true;
			buttonClicked = (i.customId);
			console.log(`Schedule Button Clicked:\n   User: ${user}\n   ButtonClicked: ${buttonClicked}`);

			user = assignPriority(user);

			if (buttonClicked === "yes" ) {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					return
				}

				else if (yesEntry.indexOf(user + " 🔸") > -1) {
					yesEntry[yesEntry.indexOf(user + " 🔸")] = user;
				}

				else if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
					yesEntry.push(user);
				}

				else {
					yesEntry.push(user);
				}

				
				let [yesString, noString] = createString(yesEntry, noEntry); //array size
				let mainEmbed = createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry); 
				let buttons = createButton(); 

				await i.editReply({
					embeds: [mainEmbed], 
					components: [buttons],
				});
			}

			else if (buttonClicked === "maybe" ) {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry[yesEntry.indexOf(user)] = (user + " 🔸");
				}

				else if (yesEntry.indexOf(user + " 🔸") > -1) {
					return
				}

				else if (noEntry.indexOf(user) > -1) {
					noEntry.splice(noEntry.indexOf(user), 1);
					yesEntry.push(user + " 🔸");
				}

				else {
					yesEntry.push(user + " 🔸");
				}

				

				let [yesString, noString] = createString(yesEntry, noEntry);
				let mainEmbed = createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry); 
				let buttons = createButton();

				await i.editReply({
					embeds: [mainEmbed], 
					components: [buttons],
				});
			}

			else if (buttonClicked === "no") {
				await i.deferUpdate();

				if (yesEntry.indexOf(user) > -1) {
					yesEntry.splice(yesEntry.indexOf(user), 1);
					noEntry.push(user);
				}

				else if (yesEntry.indexOf(user + " 🔸") > -1) {
					yesEntry.splice(yesEntry.indexOf(user + " 🔸"), 1);
					noEntry.push(user);
				}

				else if (noEntry.indexOf(user) > -1) {
					return
				}

				else {
					noEntry.push(user);
				}

				

				let [yesString, noString] = createString(yesEntry, noEntry);
				let mainEmbed = createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry); 
				let buttons = createButton(); 

				await i.editReply({
					embeds: [mainEmbed], 
					components: [buttons],
				});
			}

			doingUpdate = false;
		});;


		// 30 Minutes after Scheduled time has passed.
		collector.on('end', async i => {
			console.log("Ended Schedule Message");

			var buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('yes')
					.setLabel('Yes')
					.setStyle('SUCCESS')
					.setEmoji('👍')
					.setDisabled(true),

				new MessageButton()
					.setCustomId('maybe')
					.setLabel('Maybe')
					.setStyle('PRIMARY')
					.setEmoji('🤷')
					.setDisabled(true),

				new MessageButton()
					.setCustomId('no')
					.setLabel('No')
					.setStyle('DANGER')
					.setEmoji('👎')
					.setDisabled(true),
			);

			await interaction.editReply({
				components: [buttons]
			});
		});
	},
};


function createEmbed(yesString, noString, timeScheduled, yesEntry, noEntry) {

	let [countdownHour, countdownMinute, totalMinutes, epochTime] = getCountdown(timeScheduled);

	if (totalMinutes > 0) {
		var countdownOutput = (`Starting in ${countdownHour}H ${countdownMinute}M`);
	}
	else {
		var countdownOutput = (`Started!`);
	}

	var mainEmbed = new MessageEmbed()
	.setColor('0xFF6F00')
	.setTitle('10 Man')
	.setURL('https://10man.commoncrayon.com/')
	.setDescription('Join a 10 Man!')
	.addFields(
		{ name: 'Time:', value: `<t:${epochTime}>` },
		{ name: 'Countdown:', value: countdownOutput},
		{ name: `__Yes(${yesEntry.length}):__`, value: yesString, inline: true},
		{ name: `__No(${noEntry.length}):__`, value: noString, inline: true },
		)
	.setFooter('Server IP: connect crayon.csgo.fr:27015; password fun', 'https://i.imgur.com/nuEpvJd.png')
	return mainEmbed;
}


function createButton() {

	var buttons = new MessageActionRow()
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
				.setEmoji('🔸'),

			new MessageButton()
				.setCustomId('no')
				.setLabel('No')
				.setStyle('DANGER')
				.setEmoji('👎'),
		);
	return buttons;
}


function createString(yesEntry, noEntry) {
	// For Yes
	if (yesEntry.length == 0){
		yesString = "Empty";
	}
	else {
		yesString = "";
		for (var l = 0; l < yesEntry.length; l++) {
			if (l == 9) {
				yesString = (yesString + yesEntry[l] + '\n🔹➖➖➖➖🔹\n');
			}
			else {
				yesString = (yesString + yesEntry[l] + '\n');
			}
			
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

	return [yesString, noString];
}


function getCountdown(timeScheduled) {
    const scheduledTimeArray = timeScheduled.split(":");

    var d = new Date();
    var cetHour = d.getUTCHours()+2;  //CHANGE FOR CET/CEST
    var cetMinute = d.getUTCMinutes();
    
    var cetTime = (cetHour*60 + cetMinute);
    
    var integerUTCHour = parseInt(scheduledTimeArray[0], 10);
    var integerUTCMin = parseInt(scheduledTimeArray[1], 10);
    var integerCET = parseInt(cetTime, 10);
    
    scheduledMinutes = (integerUTCHour*60 + integerUTCMin);
    
    totalMinutes = (scheduledMinutes - integerCET);
    
    
    countdownHour = Math.floor(totalMinutes / 60);
    countdownMinute = (totalMinutes - countdownHour*60);

	// Get Epoch Time
	var epochTime = new Date();
	epochTime.setHours(integerUTCHour+8, integerUTCMin, 0, 0); // CET/CEST might change things!
	var epochTime = String(epochTime.getTime());
	epochTime = epochTime.slice(0, -3)

    return [countdownHour, countdownMinute, totalMinutes, epochTime];
}


function assignPriority(user) {
	const priority = [
		"Roald",
		"linkinblak",
		"QueeN",
		"DashBash",
		"Royal Bacon",
		"<@431743926974808076>", // k0vac
		"Amajha",
		"CaJeB3",
		"ShadowPoor",
		"Rik",
		"Jeppi",
		"CommonCrayon",
		"Thisted",
	]; 

	for (var i = 0; i < priority.length; i++) {
		if (user === priority[i]){
			user = "🎗️" + user;
		}
	}
	return user;
}