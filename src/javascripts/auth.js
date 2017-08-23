let Auth = {};

Auth.saveToken = (token)=>{
	localStorage.setItem('voting-app', token)
};
Auth.getToken = ()=>{
	return localStorage.getItem('voting-app');
};
Auth.isLoggedIn = ()=>{
	let token = Auth.getToken();
	if(token){
		let exp = JSON.parse(window.atob(token.split('.')[1])).exp;
		return exp > Date.now() / 1000;
	}else{
		return false
	}
};
Auth.isLoggedOut = ()=>{
	let token = Auth.getToken();
	if(!token){
		return true;
	}else{
		return false;
	}
};
Auth.currentUserName = ()=>{
	if(Auth.isLoggedIn()){
		let token = Auth.getToken();
		let username = JSON.parse(window.atob(token.split('.')[1])).username;
		return username;
	}
};
Auth.currentUserID = ()=>{
	if(Auth.isLoggedIn()){
		let token = Auth.getToken();
		let id = JSON.parse(window.atob(token.split('.')[1]))._id;
		return id
	}
};
Auth.logout = ()=>{
	localStorage.removeItem('voting-app');
}

export default Auth;
