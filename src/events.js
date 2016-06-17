var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

var ListEvent = require('./list-event');


module.exports = React.createClass({
	mixins: [ReactFire],
	getInitialState: function() {
	return {
			authId: false,
			events: false,
			guests: false,
			addEvent: false,
			meals: [],
			edit: false
		}
	},
	componentWillMount: function() {
		console.log(this.props.user)

		// Preload guest & event data
		var authData = ref.getAuth();

	  	// Set auth as a state
		this.setState({ authId: authData.uid});

	},
	render: function() {

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

	return <div>

			{this.props.user &&
				<div className="row">
					<div className="col-md-6">
						<h4>{this.props.user.onb2_event ? "Events" : "Edit your events below" }</h4>
					</div>
					<div className="col-md-6 tar">
						<button onClick={this.onToggleAddEvent.bind(this,"add","event")} className="btn btn-success">Add event</button>
					</div>
				</div>
			}

					{this.props.user.events &&

						<div className="row">

							{Object.keys(this.props.user.events).map(function (key, i) {
								return <ListEvent event={this.props.user.events[key]} user={this.props.user} key={i} id={key} userId={this.state.authId} edit={this.state.edit} countAttending={countEvents(key,"attending")} countGuests={countEvents(key,"guests")}/>

							}.bind(this))}

						<div className="col-md-4">
						{this.state.addEvent &&
							<div>
								<h4>Add Event</h4>
								<input type="text" className="form-control" placeholder="Enter event name" ref="eventName" /><br />
								<p>
									<label>From</label>
									<input type="text" className="form-control" placeholder="00:00" ref="eventFTime" />
								</p>
								<p>
									<label>To</label>
									<input type="text" className="form-control" placeholder="06:00" ref="eventTTime" />
								</p>

								<label>Address</label>
								<input type="text" className="form-control" placeholder="Address" ref="eventAddress" name="address" /><br />

								<label>Postcode</label>
								<input type="text" className="form-control" placeholder="Postcode" ref="eventPostcode" name="postcode" /><br />


								<h5>Add meals</h5>
								{this.state.meals &&
									this.state.meals.map(function(meal, i) {
										return <div key={i}>{meal} <a onClick={this.deleteMeal.bind(this, i) }>Delete</a></div>
									}.bind(this))
								}
								<p><input type="text" className="form-control" placeholder="Enter meal name" ref="mealName" /><a className="btn btn-info" onClick={this.handleMeal}>+</a></p>

								<p><a className="btn btn-primary" onClick={this.handleEvent}>Add Event</a></p>
							</div>

						}

						</div>

 						</div>
					}



	       </div>
	},
	handleEvent: function(e) {
		e.preventDefault();
		var timeInMs = Date.now();
		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.state.authId +"/events");
		var mealRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.state.authId + "/meals");
		var randomNo = Math.floor(Math.random() * 1000) + 1;

		// Unique ID
		var string = (this.refs.eventName.getDOMNode().value + randomNo).replace(/ /g,'').toLowerCase();

		// Times - need a date
		var fromTime = this.refs.eventFTime.getDOMNode().value;
		var toTime = this.refs.eventTTime.getDOMNode().value;

		// Meal loop
		var mealsArray = {};

		// If meals then add, if not show false
		if(this.state.meals.map) {
			this.state.meals.map(function(meal, i) {
				var mealId = (meal + randomNo).replace(/ /g,'').toLowerCase()
				mealsArray[mealId] = true;

				// Save meal
				mealRef.child(mealId).set({
					date_created: timeInMs,
					name: meal,
			    	event: string
			    }, function(error) {
						// Error report event
						if (error) {
						console.log("Meal could not be saved" + error);
					} else {
						console.log(mealId + " meal saved");
					}

				});

			}.bind(this));

		} else {
			mealsArray = false;
		}


		// Save event
		firebaseRef.child(string).set({
			date_created: timeInMs,
			name: this.refs.eventName.getDOMNode().value,
	    	from: fromTime,
	    	to: toTime,
	    	address: this.refs.eventAddress.getDOMNode().value,
	    	postcode: this.refs.eventPostcode.getDOMNode().value,
	    	attending: false,
	    	invited: false,
	    	meals: mealsArray
	    }, function(error) {
				// Error report event
				if (error) {
				console.log("Event could not be saved" + error);
			} else {
				console.log(string + " event saved");
			}

		});


	},
	handleMeal: function(){
		var mealValue = this.refs.mealName.getDOMNode().value;
		var mealsState = this.state.meals;

		mealsState.push(mealValue);

		this.setState({ meals: mealsState });
		console.log(this.state.meals);
	},
	deleteMeal: function(id) {
		var mealsState = this.state.meals;
		delete mealsState[id];

		this.setState({ meals: mealsState });
		console.log(this.state.meals);
	},
	onToggleAddEvent: function(action,type) {
		this.props.handleAction(action,type);
	}
});
