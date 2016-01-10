var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var Guests = require('./guests'); 
var Attending = require('./attending'); 

// Upload file shiz
var Dropzone = require('react-dropzone');
var request = require('superagent');

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
			authId: false,
			files: []
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
		if(this.state.users.guests) {
			
		}
	},
	render: function() { 
		var guests = this.state.users.guests;

		// Count the guests
		if(this.state.users.guests) {
			var countGuests = 0;
			for ( guest in guests )   {
			   if(guests.hasOwnProperty(guest)) {
			      countGuests++;
			   }
			}

		}

		return <div className="dashboard"> 
					<div className="dashboard__header">
						<Link to={`/dashboard`}>
							<img src="../img/confetti_logo.svg" alt="Confetti - A new digital tradition" />
						</Link>
					</div>

					<div className="dashboard-grid">

						<div className="dashboard-grid__column">
							<div className="dashboard-grid--nest dashboard-grid--dark column__flex-column">

								<div className="column">
									<span className="badge badge--large">{countGuests}</span>
									<span className="badge--text-large">Invited</span>
								</div>
								<div className="column">
									<span className="badge badge--outline badge--blue">50</span>
									<span className="badge--text">Ceremony</span>

									<span className="badge badge--outline badge--blue">50</span>
									<span className="badge--text">Reception</span>
								</div>

								<div className="column">
									<a href="#" className="btn btn--outline">Add Guest</a>
								</div>

								
							</div>
						</div>

						<div className="dashboard-grid__column-grid">

							<div className="dashboard-grid__column-half">
								<div className="dashboard-grid--nest">
									<Link to={`/dashboard`}>Dashboard</Link>
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
									<button onClick={this.handleLogout}>Logout</button>
								</div>
							</div>

						</div>

						<div className="dashboard-grid__column">
							<div className="dashboard-grid--nest">

            					<Dropzone onDrop={this.handleDrop}>
              						<div>Try dropping some files here, or click to select files to upload.</div>
            					</Dropzone>

							</div>
						</div>

					</div>

					<div className="dashboard__content">
						<div className="dashboard-grid--nest">
							{this.props.children ? this.props.children : <Attending />}
						</div>
					</div>

		</div>
	},
	handleLogout: function() {
    	ref.unauth();
    	this.setState({ loggedIn: false });
    	window.location.href = '/#/';
  	},
  	handleDrop: function (files) {
  		var req = request.post('/upload');
        files.forEach((file)=> {
            req.attach(file.name, file);
            console.log(file.name);
        });
        req.end(function(err, res){
    		// Do something
    		console.log(err);
		});

    },

})


// Mixin is group of methods that sits on one object and is pasted onto new component