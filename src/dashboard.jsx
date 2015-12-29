var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var Guests = require('./guests'); 

// Router Shiz
var ref = new Firebase(rootUrl);
var HashHistory = require('react-router/lib/hashhistory');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

module.exports = React.createClass({
	mixins: [ReactFire],
	getInitialState: function() {
	return { users: {},
			active: false,
			addGuest: false,
			addEvent: false,
			authId: false
		}
	},
	componentWillMount: function() {
		// Get user data
		var authData = ref.getAuth();
		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + authData.uid);
    	this.bindAsObject(firebaseRef, 'users');

    	this.setState({ authId: authData.uid});
	},
	componentDidUpdate: function() {

	},
	render: function() { 
		return <div className="dashboard"> 
					<div className="dashboard__header">
						<Link to={`/dashboard`}>
							<img src="img/confetti_logo.svg" alt="Confetti - A new digital tradition" />
						</Link>
					</div>

					<div className="dashboard-grid">

						<div className="dashboard-grid__column">
							<div className="dashboard-grid--nest">
								<h4>Hello </h4>
								<p>{this.state.authId}</p>
								<p>{this.state.users.email}</p>
								<Link to={`/dashboard`}>Dashboard</Link>
								<a href="#" onClick={this.props.onLogout}>Logout</a>
							</div>
						</div>

						<div className="dashboard-grid__column-grid">

							<div className="dashboard-grid__column-half">
								<div className="dashboard-grid--nest">
									Data
								</div>
							</div>

							<div className="dashboard-grid__column-half">
								<div className="dashboard-grid--nest">
									<Link to={`/dashboard/guests/`}>Guests</Link>
								</div>
							</div>

							<div className="dashboard-grid__column-half">
								<div className="dashboard-grid--nest">
									<Link to={`/dashboard/events/`}>Events</Link>
								</div>
							</div>
							<div className="dashboard-grid__column-half">
								<div className="dashboard-grid--nest">
									Data
								</div>
							</div>

						</div>

						<div className="dashboard-grid__column">
							<div className="dashboard-grid--nest">
								Data
							</div>
						</div>

					</div>

					<div className="dashboard__content">
						<div className="dashboard-grid--nest">
							{this.props.children}
						</div>
					</div>

		</div>
	}

})


// Mixin is group of methods that sits on one object and is pasted onto new component