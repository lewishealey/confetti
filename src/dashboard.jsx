var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var Guests = require('./guests'); 
var Choice = require('./choice'); 

// Router Shiz
var HashHistory = require('react-router/lib/hashhistory');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

module.exports = React.createClass({
	mixins: [ReactFire],
	getInitialState: function() {
	return { users: {},
			eventChoices: [],
			active: false
		}
	},
	componentWillMount: function() {
		// Get user data
		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.props.userId);
    	this.bindAsObject(firebaseRef, 'users');
	},
	componentDidUpdate: function() {

	},
	render: function() { 
	if (this.state.users.events) {

		var eventOptions = Object.keys(this.state.users.events).map(function (key, i) {
			return <Choice key={key} id={key} value={i} name={this.state.users.events[key].name} handleChoice={this.handleChoice} />
		}.bind(this));

	}
		return <div> 
			<h4>Hello {this.props.email}</h4>
			<p>{this.props.userId} {this.state.users.email}</p>
			<Link to={`/view/${this.props.userId}`}>{this.state.users.email}</Link>

			<h4>Add Guest</h4>
			<p>
				<input type="text" className="form-control" placeholder="Enter First Name" ref="fName" name="fname" /><br />
				<input type="text" className="form-control" placeholder="Enter Surname" ref="lName" name="lname" /><br />
				<input type="text" className="form-control" placeholder="Enter guest email" ref="guestEmail" name="email" /><br />
				<input type="text" className="form-control" placeholder="Address" ref="guestAddress" name="address" /><br />
					
				        {eventOptions}

				<a className="btn btn-primary" onClick={this.handleGuest}>Add Guest</a>
			</p>

			<h4>Add Event</h4>
			<p>
				<input type="text" className="form-control" placeholder="Enter event name" ref="eventName" /><br />
				<input type="text" className="form-control" placeholder="Enter event time" ref="eventTime" /><br />
				<input type="text" className="form-control" placeholder="Address" ref="eventAddress" name="address" /><br />
				<a className="btn btn-primary" onClick={this.handleEvent}>Add Event</a>
			</p>

			<Guests userId={this.props.userId} guests={this.state.users.guests} />

			<a href="#" onClick={this.props.onLogout}>Logout</a>
		</div>
	}, 
	handleChoice: function(choice,id,truth) {
		var choices = this.state.eventChoices;

		if(truth == true) {

			choices[id] = true;
			// choices.push({"event"+[id] : true});
			// this.setState({eventChoices: choices});
		} else {
			//Loop through choices and remove one you want
			delete choices[id];
			this.setState({eventChoices: choices});
		}

		console.log(this.state.eventChoices);

	},
	handleGuest: function(e) {
		e.preventDefault();
		var timeInMs = Date.now();
		var guestRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.props.userId + "/guests/");
		var randomNo = Math.floor(Math.random() * 1000) + 1;

		var choices = this.state.eventChoices;
		var string = (this.refs.fName.getDOMNode().value + this.refs.lName.getDOMNode().value + randomNo).replace(/ /g,'').toLowerCase();

		var events = {}
		{Object.keys(this.state.eventChoices).map(function(key) {

			var eventRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.props.userId + "/events/" + key + "/guests/"); 

	    	eventRef.child(string).set({ 
				[string] : true,
				invited: "true",
				attending: false
	        }, function(error) {
	  			
	  			// Error report guest
	  			if (error) {
					console.log("Event could not be saved" + error);
				} else {
					console.log(key + " event saved");
				}

			}.bind(this));

		}.bind(this))}; 

		// // Save guest
		guestRef.child(string).set({
			attending: false,
			fname: this.refs.fName.getDOMNode().value,
			lname: this.refs.lName.getDOMNode().value,
        	email: this.refs.guestEmail.getDOMNode().value,
        	date_created: timeInMs,
        	events: choices
        }, function(error) {
  			
  			// Error report guest
  			if (error) {
				console.log("Guest could not be saved" + error);
			} else {
				console.log("Guest saved");
			}

		});


	},
	handleEvent: function(e) {
		e.preventDefault();
		var timeInMs = Date.now();
		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.props.userId +"/events");
		var randomNo = Math.floor(Math.random() * 1000) + 1;

		var string = (this.refs.eventName.getDOMNode().value + randomNo).replace(/ /g,'').toLowerCase();

		// Save guest
		firebaseRef.child(string).set({
			date_created: timeInMs,
			name: this.refs.eventName.getDOMNode().value,
        	time: this.refs.eventTime.getDOMNode().value,
        	address: this.refs.eventAddress.getDOMNode().value
        }, function(error) {
  			// Error report guest
  			if (error) {
				console.log("Event could not be saved" + error);
			} else {
				console.log(string + " event saved");
			}

		});
	}

})


// Mixin is group of methods that sits on one object and is pasted onto new component