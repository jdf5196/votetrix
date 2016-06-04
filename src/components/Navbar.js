import React from 'react';
import Auth from '../javascripts/auth.js';
import Toastr from 'toastr';

class Navbar extends React.Component{
	constructor(props){
		super(props)
		this.loggedIn = this.loggedIn.bind(this);
		this.logout = this.logout.bind(this);
		this.loggingout = this.loggingout.bind(this);
		this.create = this.create.bind(this);
	}
	getName(){
		return Auth.currentUserName()
	}
	loggedIn(){
		if(Auth.isLoggedIn()){
			let id = Auth.currentUserID();
			return <li><a data-toggle='collapse' data-target='.in' href={"/#/profile/"+ id}>{this.getName()}</a></li>
		}else{
			return <li><a data-toggle='collapse' data-target='.in' href='/#/login'>Login or Register</a></li>
		}
	}
	logout(){
		if(Auth.isLoggedIn()){
			return <li><a onClick={this.loggingout} data-toggle='collapse' data-target='.in' href='/#/'>Logout</a></li>
		}else{
			return
		}
	}
	loggingout(e){
		Auth.logout();
		this.forceUpdate();
		Toastr.options.positionClass = 'toast-top-center';
		Toastr.info('You have logged out.')
	}
	create(){
		if(Auth.isLoggedIn()){
			return <li><a data-toggle='collapse' data-target='.in' href='/#/create'>Create Poll</a></li>
		}else{return}
	}
	render(){
		return(
		<nav className='navbar navbar-inverse navbar-fixed-top'>
			<div className='container'>
				<div className='navbar-header'>
					<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#collapse">
        				<span className="sr-only">Toggle navigation</span>
        				<span className="sr-only">Toggle navigation</span>
        				<span className="glyphicon glyphicon-align-justify"></span>
  					</button>
					<p className='navbar-brand'><a href="/#/">Votetrix</a></p>
				</div>
				<div className='collapse navbar-collapse' id='collapse'>
					<ul className='nav navbar-nav navbar-inverse'>
						{this.create()}
						{this.loggedIn()}
						{this.logout()}
					</ul>
				</div>
			</div>
		</nav>
		);
	}
};

export default Navbar