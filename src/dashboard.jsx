var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var Guests = require('./guests');
var Events = require('./events');
var Attending = require('./attending');
var Settings = require('./settings');
var JQuery = require('jquery');

// Upload file shiz
var Dropzone = require('react-dropzone');
var request = require('superagent');

// Onboarding

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('4gS7S9jS9Ef7rt8Hq5jtFg');

// Router Shiz
var ref = new Firebase(rootUrl);
var HashHistory = require('react-router/lib/hashhistory');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

date = Date.now();

function logging(name,object,type) {
	if(type == "obj") {
		console.log(object);
	} else {
		console.log(name + ": " + object);
	}
}


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
			sendingInvites: false,
			menu: false
		}
	},
	componentWillMount: function() {
		// Get user data
	},
	componentDidUpdate: function() {
		if(this.props.user.guests) {

		}
	},
	handleMenu: function(type) {
		this.setState({ menu: type});
	},
	render: function() {

		if(this.props.user && this.props.user.attending) {
			var attending = this.props.user.attending;
				var countAttending = 0;
				for ( attend in attending )   {
					// If attending has events
				   if(attending.hasOwnProperty(attend) && this.props.user.attending[attend].events) {
				      countAttending++;
				   }
				}
		} else {
			var countAttending = 0;
		}

		if(this.props.user && this.props.user.guests) {
			var guests = this.props.user.guests;
				var countGuests = 0;
				for ( guest in guests )   {
					 if(guests.hasOwnProperty(guest)) {
							countGuests++;
					 }
				}
		} else {
			var countGuests = 0;
		}

		if(this.props.user && this.props.user.events) {
			var events = this.props.user.events;
			// console.info(events);
		}

		function countEvents(id,type) {
			var eventData;

			if(type === "guests") {
				var eventData = events[id].guests;
			} else {
				var eventData = events[id].attending;
			}

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

		if(this.props.user && this.props.user.events) {
			var userEvents = Object.keys(this.props.user.events).map(function(key, i) {

      		return (
						<span key={i} className="count"><span className="count--blue">{countEvents(key,"guests") ? countEvents(key,"guests") : "0"}</span> {this.props.user.events[key].name}</span>
		      );
		    }.bind(this));


					var attendingEvents = Object.keys(this.props.user.events).map(function(key, i) {

		      		return (
				        	<span key={i} className="count"><span className="count--blue">{countEvents(key,"attending") ? countEvents(key,"attending") : "0"}</span> {this.props.user.events[key].name}</span>
				      );
				    }.bind(this));

		}


		return <div className="dashboard">
					<div className="dashboard__header">
						<div className="container">

							<div className="row">

							<div className="col-md-4 menu">
								<ul>
									<li><a onClick={this.handleMenu.bind(this,"home")}>Home</a></li>
									<li><a onClick={this.handleMenu.bind(this,"guests")}>Guests</a></li>
									<li><a onClick={this.handleMenu.bind(this,"events")}>Events</a></li>
									<li><a onClick={this.handleMenu.bind(this,"settings")}>Settings</a></li>
								</ul>
							</div>

							<div className="col-md-4 tac">
								<Link to={`/dashboard`}>
									<img src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/confetti_logo.png?alt=media&token=694ca44e-28d4-40ad-9aaf-2ed3800f7c49" alt="Confetti - A new digital tradition" width="200" />
								</Link>
							</div>

							<div className="col-md-4 dashboard__welcome">
								Welcome, <a onClick={this.handleLogout}>Logout</a>
							</div>

						</div>

						</div>
					</div>
					<div className="dashboard-grid">

						<div className="dashboard-grid__column">
							<div className="dashboard-grid--nest dashboard-grid--dark column__flex-column dashboard-grid-breakdown">

								<div>
									<h4 className="dashboard-grid__title">Your Breakdown</h4>
								</div>

								<div>

									<div className="row">
										<div className="col-md-4">
											<span className="badge--text-large">{countGuests} Guest{countGuests > 1 ? "s" : ""}</span>
											<span className="dashboard-grid-count__events">{userEvents}</span>
										</div>
										<div className="col-md-4">
											<span className="badge--text-large">{countAttending} Attending</span>
											<span className="dashboard-grid-count__events">{attendingEvents}</span>
										</div>
									</div>

								</div>

								<div>
									<span>Link: {"http://app.cnftti.com/#/page/" + this.props.user.username}</span>
								</div>

							</div>
						</div>

					</div>

					<div className="dashboard__content">
						<div className="dashboard-grid--nest">

							{this.renderComponent()}

						</div>
					</div>

		</div>
	},
	handleAction: function(action,type) {
		this.props.handleAction(action,type);
	},
	handlePopup: function(type,text) {
		this.props.handlePopup(type,text);
	},
	renderComponent: function() {

		if(this.state.menu) {
			if(this.state.menu == "events") {
       	return <Events user={this.props.user} handleEvent={this.handleEvent} handleEditGuest={this.handleEditEvent} handleDeleteGuest={this.handleDeleteEvent} handleAction={this.handleAction} handlePopup={this.handlePopup} />
    	}
			if(this.state.menu == "guests") {
       	return <Guests user={this.props.user} handleGuest={this.handleGuest} handleEditGuest={this.handleEditGuest} handleDeleteGuest={this.handleDeleteGuest} handleAction={this.handleAction} handlePopup={this.handlePopup} />
    	}
			if(this.state.menu == "settings") {
       	return <Settings user={this.props.user} handleCutoff={this.handleCutoff} handlePopup={this.handlePopup} />
    	}
			return <Attending user={this.props.user}  handleAction={this.handleAction} handleAction={this.handleAction} handlePopup={this.handlePopup} />

		} else {
			if(window.location.href.indexOf("events") > -1) {
       	return <Events user={this.props.user} handleEvent={this.handleEvent} handleEditGuest={this.handleEditEvent} handleDeleteGuest={this.handleDeleteEvent} handleAction={this.handleAction} handlePopup={this.handlePopup} />
    	}
			if(window.location.href.indexOf("guests") > -1) {
       	return <Guests user={this.props.user} handleGuest={this.handleGuest} handleEditGuest={this.handleEditGuest} handleDeleteGuest={this.handleDeleteGuest} handleAction={this.handleAction} handlePopup={this.handlePopup} />
    	}
			if(window.location.href.indexOf("settings") > -1) {
       	return <Settings user={this.props.user} handleCutoff={this.handleCutoff} handlePopup={this.handlePopup} />
    	}
			return <Attending user={this.props.user}  handleAction={this.handleAction} handleAction={this.handleAction} handlePopup={this.handlePopup} />
		}

	},
	handleDeleteEvent: function() {
		// Pass props up

	},
	handleEditEvent: function() {
		// Pass props up

	},
	handleEvent: function(eventName,eventAddress,eventPostcode,fromTime,toTime,course,status,id) {

		// Pass props up
		this.props.handleEvent(eventName,eventAddress,eventPostcode,fromTime,toTime,course,status,id);

		// console.log(eventName);
    // console.log(fromTime);
    // console.log(toTime);
    // console.log(eventAddress);
    // console.log(eventPostcode);
    // console.log(course);
		// console.log(status);

	},
	handleCutoff: function(cutoff) {

    this.props.handleCutoff(cutoff);

  },
	handleEditGuest: function(fname,lname,email,choices,id,action) {
		// Pass props up
		this.props.handleGuest(fname,lname,email,choices,id,action);
	},
	handleGuest: function(fname,lname,email,choices,id,action) {
		// Pass props up
		this.props.handleGuest(fname,lname,email,choices,id,action);
	},
	handleOnb1: function() {
		var username = this.refs.step_1.getDOMNode().value;
		// console.log(username);
		this.props.handleUsername(username);
	},
	handleLogout: function() {
			this.props.handleLogout();
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
				// console.log(result);
				this.setState({ sendingInvites: false });
			}.bind(this)
		});

	}

})


// Mixin is group of methods that sits on one object and is pasted onto new component
