import React from 'react';
import Toastr from 'toastr';
import Auth from '../javascripts/auth.js';
import Navbar from './Navbar.js';
import Footer from './footer.js';

class Profile extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			polls: [],
			user: {}
		}
		this.deleteButton = this.deleteButton.bind(this);
		this.pollList = this.pollList.bind(this);
		this.heading = this.heading.bind(this);
	}
	componentWillMount(){
		let user = {};
		let polls = [];
		$.get('/getuser', (data)=>{
			for(const i in data){
				if(data[i]._id == this.props.params.userId){
					user = data[i]
				}
			}
			if(!user._id){
				Toastr.options.positionClass = 'toast-top-center'
				Toastr.error('User does not exist')
				window.location.href='/#/';
			}else{
				this.setState({user: user})
			}
		});
		$.get('/getpolls', (data)=>{
			for(const i in data){
				if(data[i].creatorId == this.props.params.userId){
					polls.push(data[i])
				}
			}
			this.setState({polls: polls})
		})
	}
	componentWillReceiveProps(newProps){
		this.setState({polls: []});
		const polls = [];
		$.get('/getuser', (data)=>{
			for(const i in data){
				if(data[i]._id == this.props.params.userId){
					user = data[i]
				}
			}
			if(!user._id){
				Toastr.options.positionClass = 'toast-top-center'
				Toastr.error('User does not exist')
				window.location.href='/#/';
			}else{
				this.setState({user: user})
				this.heading();
			}
		});
		$.get('/getpolls', (data)=>{
			for(const i in data){
				if(data[i].creatorId == newProps.params.userId){
					polls.push(data[i])
				}
			}
			this.setState({polls: polls})
		})
	}
	header(){
		if(Auth.currentUserID() == this.props.params.userId){
			return(
				<h3 className='pollHeading'>Your Polls</h3>
			)
		}else{
			return(
				<h3 className='pollHeading'>Polls by this user.</h3>
			)
		}
	}
	pollList(){
		if(this.state.polls.length == 0 && Auth.currentUserID() != this.props.params.userId){
			return( 
				<tr>
					<td>No polls by this user.</td>
				</tr>
			)
		}else if(this.state.polls.length == 0 && Auth.currentUserID() == this.props.params.userId){
			return(
				<tr>
					<td>You have not created any polls yet. <a href='/#/create'>Create one here!</a></td>
				</tr>
			)
		}else{
			return (
				this.state.polls.map((poll)=>{
					return <tr key={poll._id}>
								<td><a href={"/#/poll/"+ poll._id}>{poll.title}</a></td>
								<td>Votes: {poll.totalVotes}</td>
							    <td>{this.deleteButton(poll._id)}</td>
							</tr>
				})
			)
		}
	}
	delete(id){
		let polls = this.state.polls;
		let url = '/delete/'+id;
		$.ajax({
			type: 'DELETE',
			url: url,
			success: (data)=>{
				$.get('/getpolls', (data)=>{
					let polls = []
					for(const i in data){
						if(data[i].creatorId == this.props.params.userId){
						polls.push(data[i])
						}
					}
					this.setState({polls: polls})
				});
				Toastr.options.positionClass = 'toast-top-center';
				Toastr.info('Poll Deleted')
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}

		})
	}
	heading(){
		let currentUser = Auth.currentUserID();
		if(currentUser == this.state.user._id){
			return (
				<h2>Your Polls</h2>	
			)
		}else{
			return(
				<h2>Polls created by {this.state.user.name}</h2>	
			)
		}
	}
	deleteButton(id){
		let currentUser = Auth.currentUserID();
		if(currentUser == this.props.params.userId){
			return(
				<button onClick={this.delete.bind(this, id)} className='btn btn-danger'>Delete</button>
			)
		}
	}
	render(){
		return(
			<div>
				<Navbar />
				<div className='push' />
					<div className='centered container'>
						{this.heading()}
		
							<table className='table table-hover table-striped'>
								<thead>
									<tr>
										<th>Poll</th>
										<th>Votes</th>
									</tr>
								</thead>
								<tbody>
									{this.pollList()}
								</tbody>
							</table>
					
					</div>
				<Footer />
			</div>
		)

	}
}

export default Profile;
