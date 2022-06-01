const fs = require('fs');
let idsJson = JSON.parse(fs.readFileSync('events/voiceids.json'));

let aList = [];
let bList = [];


module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState) {

		// Procedures for Counter-Strike Voice Channel - 832598037598961684
		if (newState.channelId == (`${idsJson.ids.voice10man}`)) {
			aList.push(newState.id);
		}
		if (oldState.channelId == (`${idsJson.ids.voice10man}`)) {
			aList.pop(oldState.id);
		}

		// Procedures for 10-man Voice Channel - 843598844758982666
		if (newState.channelId == (`${idsJson.ids.voiceCounterStrike}`)) {
			bList.push(newState.id);
		}
		if (oldState.channelId == (`${idsJson.ids.voiceCounterStrike}`)) {
			bList.pop(oldState.id);
		}

		const content = "List A and B:\n".concat(aList.concat("\n".concat(bList)));
		fs.appendFile('./log.txt', "\n".concat(content), function (err) {
			if (err) return console.log(err);
		});
	},
	getAList: () => {return aList;},
	getBList: () => {return bList;},
};