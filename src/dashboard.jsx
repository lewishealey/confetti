var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var Guests = require('./guests'); 

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
			return <option key={i} value={i} onClick={this.handleChoices.bind(this,this.state.users.events[key].name)} ref={"choice_" + i} value={this.state.users.events[key].name} className={this.state.active ? "btn btn-default active" : "btn btn-default" } >{this.state.users.events[key].name}</option>
		}.bind(this));

	}
		return <div>
			<h4>Hello {this.props.email}</h4>
			<p>{this.props.userId} {this.state.users.email}</p>

			<h4>Add Guest</h4>
			<p>
				<input type="text" className="form-control" placeholder="Enter guest name" ref="guestName" name="fname" /><br />
				<input type="text" className="form-control" placeholder="Enter guest email" ref="guestEmail" name="email" /><br />
				<input type="text" className="form-control" placeholder="Address" ref="guestAddress" name="address" /><br />
					
					<select multiple={true} ref="selectBox">
				        {eventOptions}
				      </select>

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
	handleChoices: function(choice) {
		var choices = this.state.eventChoices;
		choices.push(choice);
		this.setState({eventChoices: choices});
		console.log(this.state.eventChoices);
	},
	handleGuest: function(e) {
		var timeInMs = Date.now();
		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.props.userId);
		e.preventDefault();
		var choices = this.state.eventChoices;

		// Save guest
		firebaseRef.child("guests").push({
			attending: false,
			name: this.refs.guestName.getDOMNode().value,
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
		var timeInMs = Date.now();
		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.props.userId);
		e.preventDefault();

		// Save guest
		firebaseRef.child("events").push({
			date_created: timeInMs,
			name: this.refs.eventName.getDOMNode().value,
        	time: this.refs.eventTime.getDOMNode().value,
        	address: this.refs.eventAddress.getDOMNode().value
        }, function(error) {
  			
  			// Error report guest
  			if (error) {
				console.log("Event could not be saved" + error);
			} else {
				console.log("Event saved");
			}

		});
	}

})


// Mixin is group of methods that sits on one object and is pasted onto new component