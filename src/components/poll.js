
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
		$.get("https://api.ipify.org/?format=json", function(response) {
			ip = response.ip;
		});
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
			$.get("https://api.ipify.org/?format=json", function(response) {
				ip = response.ip;
			});
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
			console.log(this.state.options);
			console.log(custom);
			for(var i in this.state.polls.options){
				if(this.state.polls.options[i].name == custom){
					Toastr.options.positionClass = 'toast-top-center';
					Toastr.error('That answer is already a choice.')
					return
				}
			}
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
						<a target="_blank" href={"https://twitter.com/intent/tweet?text=Votetrix Question: "+this.state.polls.title+" - &url=https://votetrix.herokuapp.com/%23/poll/"+this.state.polls._id} class="twitter-share-button">
						<svg id='twitter' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
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
