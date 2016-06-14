var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

// Components
var ListGuest = require('./list-guest');
var Choice = require('./choice');

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
	return {
			authId: false,
			addGuest: false,
			eventChoices: []
		}
	},
	componentWillMount: function() {

		// Preload guest & event data
		var authData = ref.getAuth();
    this.setState({ authId: authData.uid});

	},
	render: function() {

		if(this.props.user.events) {
			// Loop through event choices object for simple toggle
			var eventOptions = Object.keys(this.props.user.events).map(function (key, i) {
				return <Choice key={key} id={key} value={i} name={this.props.user.events[key].name} handleChoice={this.handleChoice} />
			}.bind(this));
		} else {
			var eventOptions = "Not set";
		}

		if(this.props.user.guests) {
			// Loop through event choices object for simple toggle
			var guestOptions = Object.keys(this.props.user.guests).map(function (key, i) {
				return <ListGuest guest={this.props.user.guests[key]} key={key + i} user={this.props.user} id={key} handleEditGuest={this.handleEditGuest} handleDeleteGuest={this.handleDeleteGuest} attending={false}></ListGuest>
			}.bind(this));
		} else {
			var guestOptions = "Add a guest to get started";
		}

		// Add guest and guest list content - comes from this.props.children in router
		return <div className="cont__flex-column">

	        <div className="column">

		        <div className="guest">
					{this.state.addGuest &&
						<div className="column column--spacing-r">
							<h4>Add Guest</h4>
							<p className="sub">Enter some information about your guests</p>

							<div className="column">
								<div className="cont cont__flex-row">
									<div className="column column--spacing-r">
										<input type="text" className="form-control" placeholder="Enter First Name" ref="fName" name="fname" />
									</div>
									<div className="column">
										<input type="text" className="form-control" placeholder="Enter Surname" ref="lName" name="lname" />
									</div>
								</div>
							</div>

							<div className="column">
								<p><input type="text" className="form-control" placeholder="Enter guest email (optional)" ref="email" name="email" required/></p>
							</div>

							<div className="column column--spacing-d">
								<h5>What event/s are they invited to?</h5>
								{eventOptions}
							</div>

							<div className="column">
								<a className="btn btn--gold" onClick={this.handleGuest.bind(this)}>Add Guest</a>
							</div>

						</div>
						}

					<div className="guest__column">

						<div className="column column__half">
		            		<h4>Invited Guests</h4>
		            		<p>View your wonderful guests</p>
		        		</div>

						<div className="cont">
					      <div className="column">
					        <strong>Name</strong>
					      </div>
					      <div className="column__double">
					        <strong>Events</strong>
					      </div>
					    </div>

							{guestOptions}
						<p><a onClick={this.onToggleAddGuest} className="btn btn--outline">{this.state.addGuest ? "Hide guest add" : "Add Guest"}</a></p>
					</div>

				</div>

			</div>

		</div>
	},
	handleDeleteGuest: function(id) {
		this.props.handleDeleteGuest(id,"delete");
	},
	handleEditGuest: function(fname,lname,email,choices,id) {
		this.props.handleEditGuest(fname,lname,email,choices,id,"edit");
	},
	handleGuest: function(e) {
		// Prevent anchor firing
		e.preventDefault();

		// Vars
		var fname = this.refs.fName.getDOMNode().value;
		var lname = this.refs.lName.getDOMNode().value;
		var email = this.refs.email.getDOMNode().value;
		var choices = this.state.eventChoices;

		// Validation
		if(!fname) { alert("enter fname"); }
		if(!lname) { alert("enter lname"); }
		// if(choices.length < 1) { alert("Please select an event"); }
		if (choices === "[]") {
			alert("Please select an event");
		}

		// console.log(choices);

		if(fname && lname && choices) {
			this.props.handleGuest(fname,lname,email,choices,null,"add");

			// Resets
			this.refs.fName.getDOMNode().value = "";
			this.refs.lName.getDOMNode().value = "";
			this.refs.email.getDOMNode().value = "";
			this.setState({eventChoices: [] });
		}

		// Dev
		// logging("Fname",this.refs.fName.getDOMNode().value,false);
		// logging("Lname",this.refs.lName.getDOMNode().value,false);
		// logging("Email",this.refs.email.getDOMNode().value,false);
		// logging(false,this.state.eventChoices,"obj");

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
		//  console.log(this.state.eventChoices);

	},
	onToggleAddGuest: function() {
		this.setState({ addGuest: ! this.state.addGuest })
	}

});
