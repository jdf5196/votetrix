'use strict';

const mongoose = require('mongoose');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('express-jwt');
const db = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/votingapp';
mongoose.connect(db);
require('./models/poll.js');
require('./models/user.js');
require('./config/passport');
const Poll = mongoose.model('Poll');
const User = mongoose.model('User');
const secret = process.env.SECRET;
const Auth = jwt({secret: secret, userProperty: 'payload'});

const app = express();
app.use(compression());

const port = process.env.PORT || 5000;

app.set('port', port);

app.use(express.static(process.cwd() + '/build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }) );
app.use(passport.initialize());

app.post('/polls', Auth, (req, res) => {
	let poll = new Poll;
	poll.title = req.body.title;
	poll.creatorId = req.payload._id;
	poll.creatorName = req.payload.username;
	poll.options = req.body.options.map( option =>{
		return (
			{name: option.name, votes: 0}
		)
	});
	poll.totalVotes = 0;
	poll.save((err, poll)=>{
		if(err){return next(err);}
	});
	res.json(poll);

});

app.get('/getuser', (req, res)=>{
	User.find((err, users)=>{
		if(err){return err};
		res.json(users);
	});
});

app.get('/getpolls', (req, res)=>{
	Poll.find((err, polls)=>{
		if(err){return err};
		res.json(polls);
	});
});

app.put('/vote', (req, res)=>{
	if(req.body.loggedIn == 'true'){
		const poll = req.body.poll, vote = req.body.vote, user = req.body.user;
		Poll.findOne({_id: poll._id}, (err, aPoll)=>{
		if(err){return err};
		if(aPoll.votersID.indexOf(user) > -1){
			res.json({Data: 'Voted'})
		}else{
		for(const i in aPoll.options){
			if(aPoll.options[i]._id == vote){
				aPoll.options[i].votes++
				aPoll.totalVotes++
				aPoll.votersID.push(user);
				aPoll.save((err, aPoll)=>{
					if(err){return next(err)}
				})
			}
		}
		res.json(aPoll);
		}
	});
	}else if(req.body.loggedIn == 'false'){
		const poll = req.body.poll, vote = req.body.vote, user = req.body.user, ip = req.body.ip;
		Poll.findOne({_id: poll._id}, (err, aPoll)=>{
			if(err){return err};
			if(aPoll.votersIP.indexOf(ip) > -1){
				res.json({Data: 'Voted'})
			}else{
			for(const i in aPoll.options){
				if(aPoll.options[i]._id == vote){
					aPoll.options[i].votes++
					aPoll.totalVotes++
					aPoll.votersIP.push(ip);
					aPoll.save((err, aPoll)=>{
						if(err){return next(err)}
					})
				}
			}
			res.json(aPoll);
			}
		});
	}
});

app.put('/customvote', (req, res, next)=>{
	/*const poll = req.body.poll, custom = req.body.answer, user = req.payload._id;
	Poll.findOne({_id: poll._id}, (err, aPoll)=>{
		if(err){return err};
		if(aPoll.votersID.indexOf(user) > -1){
			return res.status(401).json({message:'You have already voted in this poll.'});
		}
		aPoll.options.push({name: custom, votes: 1});
		aPoll.totalVotes++;
		aPoll.votersID.push(user);
		aPoll.save((err, aPoll)=>{
			if(err){return next(err)}
			res.json(aPoll)
		})
	})*/
	console.log(req.payload)
});

app.post('/register', (req, res, next)=>{
	if(!req.body.name || !req.body.pw || !req.body.email){
		return res.status(400).json({message: 'Please fill out all fields.'})
	}
	let user = new User;
	user.name = req.body.name;
	user.email = req.body.email;
	user.setPassword(req.body.pw);
	user.save((err)=>{
		if(err){
			return res.status(400).json({message: 'Username or email address already in use.'})
		}else{
			return res.json({token: user.generateJWT()});
		}
	})
})

app.post('/login', function(req, res, next){
	if(!req.body.username || !req.body.password){
		return res.status(400).json({message:'Please fill out all fields.'});
	}
	passport.authenticate('local', function(err, user, info){
		if(err){return next(err);}

		if(user){
			return res.json({token: user.generateJWT()});
		}
		else{
			return res.status(401).json(info);
		}
	})(req, res, next);
});

app.delete('/delete/:id', Auth, (req, res)=>{
	let user = req.payload._id;
	Poll.findOne({_id: req.params.id}, (err, aPoll)=>{
		if(aPoll.creatorId != user){
			return res.status(401).send('Unauthorized')
		}else{
			Poll.remove({Poll: aPoll}, (err)=>{
				if(err){return err}
				aPoll.remove((err)=>{
					if(err){return err}
					res.send('success');
				})
			})
		}
	})
})

app.listen(app.get('port'), function(){
	console.log('Server listening on port ' + port);
});