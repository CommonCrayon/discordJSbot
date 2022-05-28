module.exports = {
	name: 'voiceStateUpdate',
	execute(oldState, newState) {

		aList = ( typeof aList != 'undefined' && aList instanceof Array ) ? aList : []
	
		if (newState.channelId == "832598037598961684") {
			aList.push(newState.id);
		}
		if (oldState.channelId == "832598037598961684") {
			aList.pop(oldState.id);
		}

		bList = ( typeof bList != 'undefined' && bList instanceof Array ) ? bList : []

		if (newState.channelId == "843598844758982666") {
			bList.push(newState.id);
		}
		if (oldState.channelId == "843598844758982666") {
			bList.pop(oldState.id);
		}
	
	},
	getAList: () => {return aList;},
	getBList: () => {return bList;},
};