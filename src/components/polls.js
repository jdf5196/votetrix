import React from 'react';

const Polls = (props) => {
	const pollList = props.polls.map((poll) => {
		return <tr key={poll._id}>
					<td><a href={"/#/poll/"+ poll._id}>{poll.title}</a></td>
					<td>by: <a href={"/#/profile/"+ poll.creatorId}>{poll.creatorName}</a></td>
					<td>{poll.totalVotes}</td>
				</tr>
	});
	return(
		<table className='table table-hover table-striped'>
			<thead>
				<tr>
					<th>Poll</th>
					<th>Creator</th>
					<th>Votes</th>
				</tr>
			</thead>
			<tbody>
				{pollList}
			</tbody>
		</table>
	);
};

export default Polls;
