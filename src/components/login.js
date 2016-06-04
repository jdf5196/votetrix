import React from 'react';
import Navbar from './Navbar.js';
import Footer from './footer.js';
import Toastr from 'toastr';
import Auth from '../javascripts/auth.js';

class Login extends React.Component {
	constructor(props){
		super(props);
		this.register = this.register.bind(this);
		this.login = this.login.bind(this);
	}
	register(e){
		e.preventDefault();
		let email = this.refs.rEmail.value;
		let name = this.refs.rName.value;
		let pw = this.refs.rPassword.value;
		let data = {
			name: name,
			email: email,
			pw: pw
		}
		$.ajax({
			type: 'POST',
			url: '/register',
			data: data,
			success: (data) => {
				Auth.saveToken(data.token)
				Toastr.options.positionClass = 'toast-top-center';
				Toastr.success('You Registered!');
				window.location.href='/#/';
			},
			error: (data)=>{
				let error = data.responseJSON.message;
				Toastr.options.positionClass = 'toast-top-center';
				Toastr.error(error);
			}
		});
	}
	login(e){
		e.preventDefault();
		let data = {
			username: this.refs.lName.value,
			password: this.refs.lPassword.value
		}
		$.ajax({
			type: 'POST',
			url: '/login',
			data: data,
			success: (data)=>{
					Auth.saveToken(data.token);
					Toastr.options.positionClass = 'toast-top-center';
					Toastr.success('You have logged in!')
					window.location.href='/#/';
			},
			error: (data)=>{
				let error = data.responseJSON.message;
				Toastr.options.positionClass = 'toast-top-center';
				Toastr.error(error)
			}
		});
	}
	render(){
		return(
			<div>
				<Navbar />
				<div className='push' />
				<div className='container'>
					<form>
						<h1>Log In</h1>
						<div className='form-group'>
							<input className='form-control' type='text' ref='lName' placeholder='Username'></input>
						</div>
						<div className='form-group'>
							<input className='form-control' type='password' ref='lPassword' placeholder='Password'></input>
						</div>
						<button onClick={this.login} type='submit' className='btn btn-primary'>Log In</button>
					</form>
				</div>
				<div className='container'>
					<form>
						<h1>Register</h1>
						<div className='form-group'>
							<input className='form-control' type='email' ref='rEmail' placeholder='Email'></input>
						</div>
						<div className='form-group'>
							<input className='form-control' type='text' ref='rName' placeholder='Username'></input>
						</div>
						<div className='form-group'>
							<input className='form-control' type='password' ref='rPassword' placeholder='Password'></input>
						</div>
						<button onClick={this.register} type='submit' className='btn btn-primary'>Register</button>
					</form>
				</div>
				<Footer />
			</div>
		)
	}
}

export default Login;