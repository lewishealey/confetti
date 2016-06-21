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
		  }
			if(type === "attending") {
		    var eventData = events[id].attending;
		  }

			if(type === "notattending") {
				var eventData = events[id].notattending;
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
								return <ListEvent event={this.props.user.events[key]} handleEvent={this.handleEvent} user={this.props.user} key={i} id={key} userId={this.state.authId} edit={this.state.edit} countAttending={countEvents(key,"attending")} countGuests={countEvents(key,"guests")} countNot={countEvents(key,"notattending")}  />
							}.bind(this))}

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
