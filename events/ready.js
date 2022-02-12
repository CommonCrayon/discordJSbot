module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setActivity("10 Man", { type: 'PLAYING'});
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};