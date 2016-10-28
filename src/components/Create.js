import React from 'react';
import Navbar from './Navbar.js';
import Footer from './footer.js';
import Toastr from 'toastr';
import Auth from '../javascripts/auth.js';


class Create extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			title: '',
			options: [{name: ''}, {name: ''}]
		};
		this.addPoll = this.addPoll.bind(this);
		this.change = this.change.bind(this);
		this.addInput = this.addInput.bind(this);
	}
	componentWillMount(){
		if(Auth.isLoggedOut()){
			Toastr.options.positionClass = 'toast-top-center'
			Toastr.error('Please log in or register to create a poll.')
			window.location.href='/#/login';
		}
	}
	inputChange(index, e){
		let oldOptions = this.state.options;
		oldOptions[index] = {name: e.target.value};
		this.setState({options: oldOptions})
	}
	change(){
		this.setState({
			title: this.refs.title.value,
		})
	}
	addInput(e){
		e.preventDefault();
		let oldOptions = this.state.options;
		oldOptions.push({name: ''});
		this.setState({options: oldOptions})
	}
	removeInput(index, e){
		e.preventDefault();
		let oldOptions = this.state.options;
		oldOptions.splice(index, 1);
		this.setState({options: oldOptions})
	}
	addPoll(e){
		if(Auth.isLoggedOut()){
			Toastr.options.positionClass = 'toast-top-center'
			Toastr.error('Please log in or register to create a new poll.')
			window.location.href='/#/login';
		}
		let empty = Boolean;
		e.preventDefault();
		for(const i in this.state.options){
			if(this.state.options[i].name === ''){
				empty = true
			}
		}
		if(this.state.title === '' || empty === true){
			Toastr.options.positionClass = 'toast-top-center'
			Toastr.error('Please fill out form completely')
			return
		}
		let data = {
			title: this.state.title,
			options: this.state.options.map((option)=>{
					return(
						{name: option.name}
					)
				})
		}
		console.log(Auth.getToken())
		$.ajax({
			type: 'POST',
			url: '/polls',
			data: data,
			success: (data) => {
				Toastr.options.positionClass = 'toast-top-center'
				Toastr.success('Poll created!')
				window.location.href='/#/poll/'+data._id;
				this.setState({
					title: '',
					options: [{name: ''}, {name: ''}]
				})
			},
			beforeSend: (xhr, settings)=>{
				xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken())
			}
		});
	}
	render(){
		return(
			<div>
				<Navbar />
				<div className='push' />
				<div className="input-container container">
					<form className='center form-group'>
						<h1>Create a Poll</h1>
						<input className='form-control' onChange={this.change} value={this.state.title} ref='title' placeholder='Question...' />
						{this.state.options.map((option, index)=>{
							return(
								<div key={index}>
									<div className='btn btn-danger remove' onClick={this.removeInput.bind(this, index)}>X</div>
									<input className='form-control option' onChange={this.inputChange.bind(this, index)} placeholder={'Option '+(index +1)} value={this.state.options[index].name} />
								</div>
							)
						})}
						<div className='button-div'>
							<button onClick={this.addPoll} className='btn btn-success button'>Submit New Poll</button>
							<button className='btn btn-info button' onClick={this.addInput}>Additional Option</button>
						</div>
					</form>
				</div>
				<Footer />
			</div>
		);
	}
}

export default Create