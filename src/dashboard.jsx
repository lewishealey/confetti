var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var Guests = require('./guests'); 
var Attending = require('./attending'); 
var JQuery = require('jquery'); 

// Upload file shiz
var Dropzone = require('react-dropzone');
var request = require('superagent');

// Onboarding
var DatePicker = require('react-date-picker');

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('4gS7S9jS9Ef7rt8Hq5jtFg');

// Router Shiz
var ref = new Firebase(rootUrl);
var HashHistory = require('react-router/lib/hashhistory');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

date = Date.now(); 

module.exports = React.createClass({
	mixins: [ReactFire],
	getInitialState: function() {
	return { users: false,
			active: false,
			addGuest: false,
			addEvent: false,
			authId: false,
			guests: false,
			files: [],
			sendingInvites: false
		}
	},
	componentWillMount: function() {
		// Get user data
		var authData = ref.getAuth();
		firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + authData.uid);
    	this.bindAsObject(firebaseRef, 'users');

    	this.setState({ authId: authData.uid});
	},
	componentDidUpdate: function() {
		if(this.state.users.guests) {
			
		}
	},
	render: function() { 

		var attending = this.state.users.attending;

		// Count the guests
		if(attending) {
			var countAttending = 0;
			for ( attend in attending )   {
			   if(attending.hasOwnProperty(attend)) {
			      countAttending++;
			   }
			}
		} else {
			var countAttending = 0;
		}


		var guests = this.state.users.guests;

		// Count the guests
		if(guests) {
			var countGuests = 0;
			for ( guest in guests )   {
			   if(guests.hasOwnProperty(guest)) {
			      countGuests++;
			   }
			}
		} else {
			var countGuests = 0;
		}

		var events = this.state.users.events;

		function countEvents(id) {

			var eventData = events[id].guests;

			if(eventData) {
				var countEvent = 0;
				for ( event in eventData )   {
				   if(eventData.hasOwnProperty(event)) {
				      countEvent++;
				   }
				}
			}

			return countEvent;

		}

		if(this.state.users.events) {
			var userEvents = Object.keys(this.state.users.events).map(function(key, i) {

      		return (
		        <div key={i}>
		        	<span className="badge badge--outline badge--blue">{countEvents(key)}</span>
		        	<span className="badge--text">{this.state.users.events[key].name}</span>
		        </div>
		      );
		    }.bind(this));
		}

		// if (this.state.users.settings) { // needs if image
		// 	var drop = <img src={"upload/" + this.state.users.settings.image} width="200" />;
		// } else {
		// 	var drop = <Dropzone onDrop={this.handleDrop}>
		// 		<div>Try dropping some files here, or click to select files to upload.</div>
		// 	</Dropzone>; 
		// }

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
									<span className="badge badge--large">{countAttending}</span>
									<span className="badge--text-large">Attending</span> 
								</div>
								<div className="column">
									<div className="column--nest-v">
										{userEvents}
									</div>
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
									<button onClick={this.handleMail}>Email</button>
									<button onClick={this.handleLogout}>Logout</button>
								</div>
							</div>

						</div>

						<div className="dashboard-grid__column">
							<div className="dashboard-grid--nest">
								<button className="btn btn--invite" onClick={this.handleMail}>{this.state.sendingInvites ? "Sending" : "Send Invites"}</button>
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
	handleOnb1: function(datastring, moment) {
		console.log(datastring);

		firebaseRef.update({
          onb1_wdate: datastring
        });

	},
	handleLogout: function() {
    	ref.unauth();
    	this.setState({ loggedIn: false });
    	window.location.href = '/#/';
  	},
  	handleDrop: function (files) {
  		var authData = ref.getAuth();
  		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + authData.uid);
  		var req = request.post('upload/');
        files.forEach((file)=> {
            req.attach(file.name, file);
            console.log(file.name);

   //          firebaseRef.child("settings").update({
			// 	image: file.name
			// }); 

        });

        req.end(function(err, res){
    		// Do something
    		console.log(err);
		});



    },
    handleMail: function(event) {
		var dataString = 'user='+ this.state.authId;

		event.target.value = "loading";

		this.setState({ sendingInvites: true });

		JQuery.ajax({
			type: "POST",
			url: "invite.php",
			data: dataString,
			cache: false,
			success: function(result){
				console.log(result);
				this.setState({ sendingInvites: false });
			}.bind(this)
		});
		
	}

})


// Mixin is group of methods that sits on one object and is pasted onto new component