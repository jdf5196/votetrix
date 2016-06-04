
import React from 'react';
import Toastr from 'toastr';
import Navbar from './Navbar.js';
import Error from '../temp-data/error.js';
import Footer from './footer.js';
import Chart from './chart.js';
import Auth from '../javascripts/auth.js';

let PollData = [];
let optionData = [];
let ip = '';
let custom = '';
let copy = (arr)=>{
	let newArr = arr.slice(0);
	for(var i = newArr.length; i--;){
		if(newArr[i] instanceof Array){
			newArr[i] = copy(newArr[i]);
		};
	};
	return newArr
};
let customAnswer = false;


class Poll extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			polls: {options: [{name: ''}, {name: ''}]},
			options: {options: [{name: ''}, {name: ''}]}
		}
		this.submit = this.submit.bind(this);
		this.chart = this.chart.bind(this);
		this.showCustom = this.showCustom.bind(this);
		this.customChange = this.customChange.bind(this);
		this.voted = this.voted.bind(this);
	}
	componentWillMount(){
		$.get("http://ipinfo.io", function(response) {
			ip = response.ip;
		}, "jsonp");
		$.get('/getpolls', (data) => {
			PollData = data;
			const find = id => {
				for(var i in data){
					if(data[i]._id == id){
						return data[i]
					}
				}
			}
			let aPoll = find(this.props.params.pollId);
			let oPoll = {};
			oPoll.options = copy(aPoll.options);
			if(Auth.isLoggedIn()){oPoll.options.push({name: 'Custom Answer', _id: 0})}
			if(aPoll === undefined){
				this.setState({polls: Error[0]})
				Toastr.options.positionClass = 'toast-top-center'
				Toastr.error('Poll does not exist')
				window.location.href='/#/';
			}else{
				this.setState({polls: aPoll, options: oPoll});
			}
		});
	}
	componentWillReceiveProps(newProps){
			$.get("http://ipinfo.io", function(response) {
				ip = response.ip;
			}, "jsonp");
			const find = id => {
				for(var i in PollData){
					if(PollData[i]._id == id){
						return PollData[i]
					}
				}
			}
			let newPoll = find(newProps.params.pollId);
			let newoPoll = {};
			newoPoll.options = copy(newPoll.options);
			if(Auth.isLoggedIn()){newoPoll.options.push({name: 'Custom Answer', _id: 0})}
			if(newPoll === undefined){
				this.setState({polls: Error[0]})
				Toastr.options.positionClass = 'toast-top-center'
				Toastr.error('Poll does not exist')
				window.location.href='/#/';
			}else{
				Chart.destroy();
				Chart.remake();
				this.setState({polls: newPoll, options: newoPoll});
				this.chart();
			}
	}
	chart(){
		if(this.state.polls.totalVotes == 0){
			return(
				<div>
					<div className='noshow'>
						<Chart data={this.state.polls.options} />
					</div>
				</div>
			)
		}else{
			return(
				<div>
					<div>
						<Chart data={this.state.polls.options} />
					</div>
				</div>
			)
		}
	}
	showCustom(){
		if(Auth.isLoggedIn()){
			return(
				<div><input id='custom' onChange={this.customChange} type='text' className='customInput hidden' placeholder='Custom answer' ref='custom' /><br /></div>
			)
		}
	}
	customChange(){
		custom = this.refs.custom.value;
	}
	voted(){
		let voted = Boolean;
		let ips = this.state.polls.votersIP;
		let users = this.state.polls.votersID;
		if(Auth.isLoggedIn()){
			for(const i in users){
				if(users[i] == Auth.currentUserID()){
					voted = true;
				}else{
					voted = false;
				}
			}
		}else{
			for(const i in ips){
				if(ips[i] == ip){
					voted = true
				}else{
					voted = false
				}
			}
		}
		if(voted === true){
			return(
				<div className='container voted'>
					<p>You have voted in this poll already</p>
					<p>Total Votes: {this.state.polls.totalVotes}</p>
				</div>
			)
		}else{
			return(
				<div className='selection'>
					<form onChange={this.changeForm.bind(this)} id='form' className='pollForm'>
						<select>
						{this.state.options.options.map( option => {
							return (
										<option key={this.state.options.options.indexOf(option)} type='radio' id={option._id} name='select' value={option._id}>{option.name}</option>
									)
						})}
						</select>
						<br />
						{this.showCustom()}
						<button onClick={this.submit} type='submit' className='btn btn-success submitPoll'>Vote</button>
					</form>
					<p>Total Votes: {this.state.polls.totalVotes}</p>
				</div>
			)
		}
	}
	changeForm(){
		let selections = document.getElementsByName('select');
		for(var i in selections){
				if(selections[i].selected){
					if(selections[i].value == 0){
						document.getElementById('custom').classList.remove('hidden');
					}
				}
			}
	}
	submit(e){
		e.preventDefault();
		if(custom != ''){
			if(Auth.isLoggedOut()){
				return
			}
			let selections = document.getElementsByName('select');
			for(var i in selections){
				if(selections[i].selected){
					if(selections[i].value == 0){
						let data = {poll: this.state.polls, answer: custom};
						$.ajax({
							type: 'PUT',
							url: '/customvote',
							data: data,
							success: (data) => {
								Chart.destroy();
								Chart.remake();
								this.setState({polls: data});
								this.chart();
								custom = '';
								Toastr.options.positionClass = 'toast-top-center'
								Toastr.success('You voted!')
							},
							error: (data)=>{
								let error = data.responseJSON.message;
								Toastr.options.positionClass = 'toast-top-center';
								Toastr.error(error)
							},
							beforeSend: (xhr, settings)=>{
								xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
							}
						})
					}
				}
			}
		}else{
			let selections = document.getElementsByName('select');
			let selection = '';
			for(var i in selections){
				if(selections[i].selected){
					selection = selections[i].value
				}
			}
			let data = {};
			if(selection == ''){
				Toastr.options.positionClass = 'toast-top-center'
				Toastr.error('Please select an answer.')
				return
			}
			if(Auth.isLoggedIn()){
				data = {poll: this.state.polls, vote: selection, user: Auth.currentUserID(), loggedIn: true}
			}else if(Auth.isLoggedOut()){
				data = {poll: this.state.polls, vote: selection, ip: ip, loggedIn: false}
			}
			$.ajax({
				type: 'PUT',
				url: '/vote',
				data: data,
				success: (data) => {
					if(data.Data == 'Voted'){
						Toastr.options.positionClass = 'toast-top-center'
						Toastr.error('A vote from this user or IP address has already been counted.')
						return
					}else{
						Chart.destroy();
						Chart.remake();
						this.setState({polls: data});
						this.chart();
						Toastr.options.positionClass = 'toast-top-center'
						Toastr.success('You voted!')
					}
				}
			});
		}
	}
	render(){
		return(
			<div>
				<Navbar />
				<div className='push' />
				<div className='poll'>
					<div className='container pollContainer'>
						<h2 className='title col-xs-12'>{this.state.polls.title}</h2>
						{this.voted()}
						<a target="_blank" href={"https://twitter.com/intent/tweet?text=Votetrix Question: "+this.state.polls.title+" - &url=http://www.votetrix.herokuapp.com/%23/polls/"+this.state.polls._id} class="twitter-share-button">
							<img id='twitter' src='http://www.cliparthut.com/clip-arts/210/twitter-bird-210309.png' />
  						</a>
						<div className='chartDiv'>
							{this.chart()}
						</div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}

}

export default Poll;