import React from 'react';
import Polls from './polls.js';
import Navbar from './Navbar.js';
import Footer from './footer.js';
import PollData from '../temp-data/temp-polls.js'

class Home extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			polls: []
		}
		this.pollList = this.pollList.bind(this);
	}
	componentWillMount(){
		$.get('/getpolls', (data) => {
			this.setState({polls: data})
		})
	}
	pollList(){
		if(this.state.polls.length == 0){
			return (
				<p>No polls. <a href='/#/create'>Create one.</a></p>
			)
		}else{
			return(
				<Polls polls={this.state.polls} />
			)
		}
	}
	render(){
		return(
			<div>
				<Navbar />
				<div className='push'></div>
				<div className='header home-header'>
					<div className='symbol'>
						<h1 className='check'>&#x2713;</h1>
					</div>
					<h1 className='home-title'>Votetrix</h1>
					<p>Create and share your own polls.</p>
					<div className='container'>
						<a href='/#/create'><button className='btn btn-info homeBtn'>Create a Poll</button></a>
					</div>
				</div>
				<h3 className='pollHeading'>List of Polls</h3>
				<p className='homeText'>Select a poll to vote or view the results.</p>
				<div className='centered container'>
						{this.pollList()}
				</div>
				<Footer />
			</div>
		)
	}
}

export default Home
