const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
	title: String,
	options: [
		{
			name: String,
			votes: Number
		}
	],
	creatorName: String,
	creatorId: String,
	totalVotes: Number,
	votersID: [String],
	votersIP: [String]
});

mongoose.model('Poll', PollSchema);
