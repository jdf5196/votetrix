'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, useRouterHistory } from 'react-router';
import {createHashHistory } from 'history';
import $ from 'jquery';
import d3 from 'd3';
import Home from './components/home.js';
import Create from './components/Create.js';
import Poll from './components/poll.js';
import Login from './components/login.js';
import Profile from './components/profile.js';
import 'bootstrap-webpack';
import './styles/styles.scss';
import '../node_modules/toastr/toastr.scss';

const appHistory = useRouterHistory(createHashHistory)({queryKey: false});

ReactDOM.render(
	(<Router history={appHistory}>
		<Route path="/" component={Home} />
		<Route path="/poll/:pollId" component={Poll} />
		<Route path='/create' component={Create} />
		<Route path='/login' component={Login} />
		<Route path='/profile/:userId' component={Profile} />
	</Router>), 
	document.getElementById('app'));