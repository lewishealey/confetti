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
								return <ListEvent event={this.props.user.events[key]} handleEvent={this.handleEvent} user={this.props.user} key={i} id={key} userId={this.state.authId} edit={this.state.edit} countAttending={countEvents(key,"attending")} countGuests={countEvents(key,"guests")}/>

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
