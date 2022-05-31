const fs = require('fs');
const voice10man = fs.readFileSync('../commands/serverinfo/voice-10man.txt', 'utf8');
const voiceCounterStrike = fs.readFileSync('../commands/serverinfo/voice-counterstrike.txt', 'utf8');

let aList = [];
let bList = [];
let processing = false;


module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState) {

		if (processing == false) {
			processing = true;
			// Procedures for Counter-Strike Voice Channel - 832598037598961684
			if (newState.channelId == voice10man) {
				aList.push(newState.id);
			}
			if (oldState.channelId == voice10man) {
				aList.pop(oldState.id);
			}
			

			// Procedures for 10-man Voice Channel - 843598844758982666
			if (newState.channelId == voiceCounterStrike) {
				bList.push(newState.id);
			}
			if (oldState.channelId == voiceCounterStrike) {
				bList.pop(oldState.id);
			}
			processing = false;
		}
	},
	getAList: () => {return aList;},
	getBList: () => {return bList;},
};