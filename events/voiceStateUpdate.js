const fs = require('fs');
let idsJson = JSON.parse(fs.readFileSync('events/voiceids.json'));

let aList = new Array;
let bList = new Array;


module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState) {

		// Procedures for Counter-Strike Voice Channel - 832598037598961684
		if (newState.channelId == (`${idsJson.ids.voice10man}`)) aList.push(newState.id);

		if (oldState.channelId == (`${idsJson.ids.voice10man}`)) {
			if ((aList.indexOf(oldState.id)) !== -1) aList.splice((aList.indexOf(oldState.id)), 1);
		}

		// Procedures for 10-man Voice Channel - 843598844758982666
		if (newState.channelId == (`${idsJson.ids.voiceCounterStrike}`)) bList.push(newState.id);

		if (oldState.channelId == (`${idsJson.ids.voiceCounterStrike}`)) {
			if ((bList.indexOf(oldState.id)) !== -1) bList.splice((bList.indexOf(oldState.id)), 1);
		}
	},
	getAList: () => {return aList;},
	getBList: () => {return bList;},
};