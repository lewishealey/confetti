var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

module.exports = React.createClass({
	mixins: [ReactFire],
	getInitialState: function() {
	return { 
			authId: false,
			events: false,
			guests: false,
			meals: []
		}
	},
	componentWillMount: function() {

		// Preload guest & event data
		var authData = ref.getAuth();
		var eventRef = new Firebase(rootUrl + 'users/' + authData.uid + "/events/");

		// Bind Events to states
	  	this.bindAsObject(eventRef, 'events'); 

	  	// Set auth as a state
		this.setState({ authId: authData.uid});

	},
	render: function() {

	return <div>
	          <h4>Events</h4>

				<div>
					<h4>Add Event</h4>
					<input type="text" className="form-control" placeholder="Enter event name" ref="eventName" /><br />
					<input type="text" className="form-control" placeholder="Enter event time" ref="eventTime" /><br />
					<input type="text" className="form-control" placeholder="Address" ref="eventAddress" name="address" /><br />

					<h5>Add meals</h5>
					{this.state.meals.map(function(meal, i) {
						return <div key={i}>Meal</div>
					})}
					<p><input type="text" className="form-control" placeholder="Enter meal name" ref="mealName" /><a className="btn btn-info" onClick={this.handleMeal}>+</a></p>

					<p><a className="btn btn-primary" onClick={this.handleEvent}>Add Event</a></p>
				</div>

				<div>
					{Object.keys(this.state.events).map(function (key, i) {
						return <div> {this.state.events[key].name} </div>
					}.bind(this))}

				</div>

	       </div> 
	},
	handleEvent: function(e) {
		e.preventDefault();
		var timeInMs = Date.now();
		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.state.authId +"/events");
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
	},
	handleMeal: function(){
		var meal = this.refs.mealName.getDOMNode().value;
		var meals = this.state.meals;

		meals.push(meal);

		this.setState({ meals: [meals] });
		console.log(this.state.meals);
	}

});
