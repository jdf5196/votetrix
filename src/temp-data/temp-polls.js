const PollData = [
	{
		id: 1,
		title: "Cats?",
		author: 'test',
		votes: 0,
		options: [
			'Yes',
			'No'
		]
	},
	{
		id: 2,
		title: "Dogs?",
		author: 'test',
		votes: 0,
		options: [
			'Yes',
			'No'
		]
	},
	{
		id: 3,
		title: "Goats?",
		author: 'test',
		votes: 0,
		options: [
			'Yes',
			'No'
		]
	}
]

export default PollData;


/*<select name='Choose'>
							{this.state.polls.options.map( option => {
								return(
									<option key={this.state.polls.options.indexOf(option)} value={option}>{option}</option>
								)
							})}
						</select>*/