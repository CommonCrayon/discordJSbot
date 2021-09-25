
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('TESTT'),


        async execute() {

            const res = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple', {
                headers: {
                    'Test-Header': 'test-value'
                }
            });
                
            const info = (res.data.results[0]);

            var category = (info.category);
            var difficulty = (info.difficulty);
            var question = (info.question);
            var correct_answer = (info.correct_answer);
            var incorrect_answers = (info.incorrect_answers);


            console.log(category, difficulty, question, correct_answer, incorrect_answers)

        }
    };