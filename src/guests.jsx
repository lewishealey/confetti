var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

// Components
var ListGuest = require('./list-guest');
var Choice = require('./choice'); 

module.exports = React.createClass({
	mixins: [ReactFire],
	getInitialState: function() {
	return { 
			authId: false,
			guests: false,
			events: false,
			addGuest: true,
			eventChoices: []
		}
	},
	componentWillMount: function() {

		// Preload guest & event data
		var authData = ref.getAuth();

		var guestRef = new Firebase(rootUrl + 'users/' + authData.uid + "/guests/");
		var eventRef = new Firebase(rootUrl + 'users/' + authData.uid + "/events/");

		// Bind guest & events to states
    	this.bindAsObject(guestRef, 'guests');
      	this.bindAsObject(eventRef, 'events'); 

      	// Set auth as a state
    	this.setState({ authId: authData.uid});

	},
	render: function() {

			// Loop through event choices object for simple toggle
		var eventOptions = Object.keys(this.state.events).map(function (key, i) {
			return <Choice key={key} id={key} value={i} name={this.state.events[key].name} handleChoice={this.handleChoice} />
		}.bind(this));



		// Add guest and guest list content - comes from this.props.children in router
		return <div className="guest__list">
			{this.state.addGuest &&
				<div>
					<h4>Add Guest</h4>
					<input type="text" className="form-control" placeholder="Enter First Name" ref="fName" name="fname" /><br />
					<input type="text" className="form-control" placeholder="Enter Surname" ref="lName" name="lname" /><br />
					<input type="text" className="form-control" placeholder="Enter guest email" ref="guestEmail" name="email" required/><br />
					<input type="text" className="form-control" placeholder="Address (optional)" ref="guestAddress" name="postal" /><br />
						
					        {eventOptions}

					<a className="btn btn-primary" onClick={this.handleGuest}>Add Guest</a>
				</div>
				}

			{this.renderList()}
		</div>
	},
	renderList: function() {

		// Go through list of guests
		if(! this.state.guests) {
			return <h4>
			Add a guest to get started
			</h4>
		} else {
			var children = [];

			for(var key in this.state.guests) {
				var guest = this.state.guests[key];
				guest.key = key;
				children.push(
					<ListGuest guest={this.state.guests[key]} key={key} userId={this.state.authId} ></ListGuest>
				)
			}

			return children;
		}
	},
	handleGuest: function(e) {
		// Prevent anchor firing
		e.preventDefault();

		// Get time
		var timeInMs = Date.now();

		// Random no to attach to name
		var randomNo = Math.floor(Math.random() * 1000) + 1;

		var choices = this.state.eventChoices;
		var string = (this.refs.fName.getDOMNode().value + this.refs.lName.getDOMNode().value + randomNo).replace(/ /g,'').toLowerCase();

		var events = {};

		// Loop through EventChoices state object
		{Object.keys(this.state.eventChoices).map(function(key) {

			// Get event data for each choice
			var eventRef = new Firebase(rootUrl + 'users/' + this.state.authId + "/events/" + key + "/guests/"); 

			// Set details to /events data
	    	eventRef.child(string).set({ 
				[string] : true,
				invited: "true",
				attending: false
	        }, function(error) {
	  			
	  		// ERROR EVENT
  			if (error) { console.log("Event could not be saved" + error); } else { console.log(key + " event saved"); }

			}.bind(this));

		}.bind(this))}; 

		// Save guest
		guestRef.child(string).set({
			attending: false,
			fname: this.refs.fName.getDOMNode().value,
			lname: this.refs.lName.getDOMNode().value,
        	email: this.refs.guestEmail.getDOMNode().value,
        	address: this.refs.guestAddress.getDOMNode().value,
        	date_created: timeInMs,
        	events: choices
        }, function(error) {
  			
  		// ERROR GUEST
  		if (error) { console.log("Guest could not be saved" + error); } else { 
  			console.log("Guest saved"); 

  			this.refs.fName.getDOMNode().value = "";
  			this.refs.guestEmail.getDOMNode().value = "";
  			this.refs.guestAddress.getDOMNode().value = "";
  			this.setState({eventChoices: []});

  		}

		}.bind(this));

	},
	handleChoice: function(choice,id,truth) {
		var choices = this.state.eventChoices;

		// Toggle - If true then add to state if nto remove
		if(truth == true) {
			choices[id] = true;
		} else {
			delete choices[id];
			this.setState({eventChoices: choices});
		}

		// DEV CHOICES
		console.log(this.state.eventChoices);

	}
});
