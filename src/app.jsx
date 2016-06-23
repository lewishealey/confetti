var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';

// Router Shiz
var HashHistory = require('react-router/lib/hashhistory');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link
var browserHistory = require('react-router').browserHistory

var View = require('./view');
var ViewMain = require('./view-main');
var ViewGuest = require('./view-new');
var ViewUser = require('./view-user');
var Dashboard = require('./dashboard');
var Guests = require('./guests');
var Events = require('./events');
var Settings = require('./settings');
var Login = require('./login');
var Register = require('./register');
var ref = new Firebase(rootUrl);
var Choice = require('./choice');

var Alert = require('./alert');

function logging(name,object,type) {
	if(type == "obj") {
		console.log(object);
	} else {
		console.log(name + ": " + object);
	}
}

function notification(status,text) {
	alert(status + " " + text);
}

var Add = React.createClass({
	mixins: [ ReactFire ],
  getInitialState: function() {
    return({
      loaded: false,
			course: {},
			eventChoices: []
    })
  },
	handleAddEvent: function() {
		var eventName = this.refs.eventName.getDOMNode().value;
		var fromTime = this.refs.eventFTime.getDOMNode().value;
		var toTime = this.refs.eventTTime.getDOMNode().value;
		var eventAddress = this.refs.eventAddress.getDOMNode().value;
		var eventPostcode = this.refs.eventPostcode.getDOMNode().value;

		this.props.handleEvent(eventName,eventAddress,eventPostcode,fromTime,toTime,this.state.course,"add");

	},
	handleCourse: function() {
		var timeInMs = Date.now();
		var randomNo = Math.floor(Math.random() * 1000) + 1;

		var courseName = this.refs.courseName.getDOMNode().value;
		var string = (courseName+ randomNo).replace(/ /g,'').toLowerCase();

		var course = this.state.course;

		course[string] = {
			date_created: timeInMs,
			name: courseName,
			meals: {}
		}

		this.setState({
			course : course
		});

	},
	handleMeal: function() {
		var timeInMs = Date.now();
		var randomNo = Math.floor(Math.random() * 1000) + 1;

		var courseSelect = this.refs.courseSelect.getDOMNode().value;
		var mealName = this.refs.mealName.getDOMNode().value;

		var string = (mealName+ randomNo).replace(/ /g,'').toLowerCase();

		var course = this.state.course;

		course[courseSelect].meals[string] = {
			date_created: timeInMs,
			name: mealName
		}

		this.setState({
			course: course
		});

	},
	handleGuest: function(e) {
		// Prevent anchor firing
		e.preventDefault();

		// Vars
		var fname = this.refs.fName.getDOMNode().value;
		var lname = this.refs.lName.getDOMNode().value;
		var choices = this.state.eventChoices;

		// Validation
		if(!fname) { alert("enter fname"); }
		if(!lname) { alert("enter lname"); }
		// if(choices.length < 1) { alert("Please select an event"); }
		if (choices === "[]") {
			alert("Please select an event");
		}

		if(fname && lname && choices) {
			this.props.handleGuest(fname,lname,null,choices,null,"add");

			// Resets
			this.refs.fName.getDOMNode().value = "";
			this.refs.lName.getDOMNode().value = "";
			this.setState({eventChoices: [] });
		}

		// Dev
		// logging("Fname",this.refs.fName.getDOMNode().value,false);
		// logging("Lname",this.refs.lName.getDOMNode().value,false);
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
	handleOpen: function() {
		this.props.handleOpen(false);
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


		var type;

		if(this.props.type == "guest") {
			type = "Guest";
		}

		if(this.props.type == "event") {
			type = "Event";
		}

		return <div className={"add " + (this.props.open ? "active" : "not")}>
			<div className="add__main">

				<div className="row">
					<div className="col-md-6">
						<h2 className="add__title">Add {type}</h2>
					</div>
						<img className="add__close" src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/close.png?alt=media&token=a2250bd0-d07a-4ffc-b10b-cf9c08566932" onClick={this.handleOpen} />
				</div>

				{this.props.type == "guest" &&

					<div>
						<div className="row">
							<div className="col-md-12">
									<p><input type="text" className="form-control" placeholder="Enter First Name" ref="fName" name="fname" /></p>
							</div>
							<div className="col-md-12">
									<p><input type="text" className="form-control" placeholder="Enter Surname" ref="lName" name="lname" /></p>
							</div>

							<div className="col-md-12">
								<h5>What event/s are they invited to?</h5>
								{eventOptions}
							</div>

							<div className="col-md-12 add__cta">
								<a className="btn btn--gold" onClick={this.handleGuest}>Add Guest</a><a className="btn btn--trans" onClick={this.handleOpen}>Cancel</a>
							</div>

						</div>
					</div>
				}

				{this.props.type == "event" &&

					<div>
						<div className="row">
							<div className="col-md-12">
									<input type="text" className="form-control" placeholder="Enter event name" ref="eventName" />
							</div>
						</div>

						<div className="row">
							<div className="col-md-6">
								<label>From</label>
								<input type="text" className="form-control" placeholder="00:00" ref="eventFTime" />
							</div>
							<div className="col-md-6">
								<label>To</label>
								<input type="text" className="form-control" placeholder="06:00" ref="eventTTime" />
							</div>
						</div>

						<label>Address</label>
						<input type="text" className="form-control" placeholder="Address" ref="eventAddress" name="address" /><br />

						<label>Postcode</label>
						<input type="text" className="form-control" placeholder="Postcode" ref="eventPostcode" name="postcode" /><br />

						<h5>Add a course</h5>
						<p><input type="text" className="form-control" placeholder="Enter meal name" ref="courseName" />
						<a className="btn btn-default" onClick={this.handleCourse}>Add course</a></p>

						<div>
							<h5>Add meals to course</h5>
							<select className="form-control" ref="courseSelect">
								{Object.keys(this.state.course).map(function (key, i) {
									return <option key={i} value={key}>{this.state.course[key].name}</option>
								}.bind(this))}
							</select>
							<input type="text" className="form-control" placeholder="Enter meal name" ref="mealName" />
							<a className="btn btn-default" onClick={this.handleMeal}>Add meal</a>
						</div>

						<div className="row">

							<div className="col-md-12 add__cta">
								<button className="btn btn--gold" onClick={this.handleAddEvent}>Add Event</button><a className="btn btn--trans" onClick={this.handleOpen}>Cancel</a>
							</div>

						</div>

			</div>
		}


			</div>
		</div>

	}
});


var App = React.createClass({
  mixins: [ ReactFire ],
  getInitialState: function() {
    return {
      register: false,
      loggedIn: false,
      loaded: false,
      onboard: false,
			action: false,
			type: false,
			open: false,
			popup: {
				open: false, text: false, type: false, count: 0
			}
    }
  },
  componentWillMount: function() {

    // Attatch state to user
    ref.onAuth(function(authData) {
      if (authData) {
        // console.log("Authenticated with uid:", authData.uid);
        this.fb = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + authData.uid);
        this.bindAsObject(this.fb, 'user');

        this.setState({loggedIn: true});
      } else {
        // console.log("Client unauthenticated.")
      }
    }.bind(this));


  },
	handleOpen: function() {
		this.setState({
			open: !this.state.open
		})
	},
	handlePopup: function(type,text) {

		this.setState({
			popup : {
				type: type,
				text: text
			}
		})

	},
  render: function() {
    // console.log(this.state.user);

    // If user is logged in show dashboard
    if (this.state.loggedIn && this.state.user) {
      return <div>

				<Alert delay={2000} type={this.state.popup.type}>{this.state.popup.text}</Alert>

				<Add type={this.state.type} action={this.state.action} user={this.state.user} handleEvent={this.handleEvent} handleGuest={this.handleGuest} handleOpen={this.handleOpen} open={this.state.open} handlePopup={this.handlePopup} />
				<Dashboard user={this.state.user} handleLogout={this.handleLogout} handleGuest={this.handleGuest} handleAction={this.handleAction} handleEvent={this.handleEvent} handleCutoff={this.handleCutoff} handlePopup={this.handlePopup} >{this.props.children}</Dashboard></div>
            // return <div><h4>Logged in</h4></div>
    } else {

    // Else show login or register form
      return <div className="login">
        <div className="login__main">
              <Login login={this.onLoginSubmit} loading={this.state.loaded} />

								<div className="login__cta">
			            <Register register={this.onRegisterSubmit} loading={this.state.loaded} />
			          </div>

            </div>
        </div>
    }

  },
	handleAction: function(action,type) {

		this.setState({
			action: action,
			type: type,
			open: !this.state.open
		})

	},
	handleCutoff: function(cutoff) {

    console.log(cutoff)

		this.fb.child("settings/").update({
			cutoff_date: cutoff
		});

  },
	handleEvent: function(eventName,eventAddress,eventPostcode,fromTime,toTime,courseData,status,id) {
		var timeInMs = Date.now();

		// console.log(eventName);
		// console.log(fromTime);
		// console.log(toTime);
		// console.log(eventAddress);
		// console.log(eventPostcode);
		// console.log(courseData);
		// console.log(status);

		if(status == "edit") {

			this.fb.child("events/" + id).update({
				date_updated: timeInMs,
				from: fromTime,
				to: toTime,
				name: eventName,
				address: eventAddress,
				postcode: eventPostcode,
				courses: courseData
			});

			this.fb.child("courses").update({
				[id]: courseData
			});

		}

		if(status == "add") {

			// Unique ID
			var randomNo = Math.floor(Math.random() * 1000) + 1;
			var string = (eventName + randomNo).replace(/ /g,'').toLowerCase();

				// Add guest
				this.fb.child("events/" + string).set({

					// Dates
					date_created: timeInMs,
					date_updated: false,

					// Personal info
					from: fromTime,
					to: toTime,
					name: eventName,
					address: eventAddress,
					postcode: eventPostcode,
					courses: courseData,

					// False for later
					invited: false, attending: false

				});

				this.fb.child("courses").update({
					[string]: courseData
				});

				this.setState({
					type: false
				});

		}


	},
  onLoginSubmit: function(userEmail,userPassword) {
    var timeInMs = Date.now();

    // Create a callback to handle the result of the authentication
    function authHandler(error, authData) {
      if (error) {
        // console.log("Login Failed!", error);
      } else {
        // console.log("Authenticated successfully with payload:", authData);
        // window.location.href = '/#/dashboard';
      }
    }

    // Auth with email/password
    ref.authWithPassword({
      email    : userEmail,
      password : userPassword
    }, authHandler);

    // Set logged in state
    ref.onAuth(function(authData) {
      this.setState({ loggedIn: true, loaded: true });
    }.bind(this));

  },
  onRegisterSubmit: function(regEmail,regPassword) {
    var timeInMs = Date.now();
    var randomNo = Math.floor(Math.random() * 1000) + 1;

    var initialEvents = {
      ["ceremony" + randomNo] : { name : "Ceremony", date_created : timeInMs, guests : false, meals : false, from: false, to: false, address: false, postcode : false },
      ["reception" + randomNo] : { name : "Reception", date_created : timeInMs, guests : false, meals : false, from: false, to: false, address: false, postcode : false }
    }

    var onBoarding = {

    }

    ref.createUser({
      email: regEmail,
      password: regPassword
    }, function(error, userData) {
      // Check data
      if (error) {
        switch (error.code) {
          case "EMAIL_TAKEN":
            // console.log("The new user account cannot be created because the email is already in use.");
            break;
          case "INVALID_EMAIL":
            // console.log("The specified email is not a valid email.");
            break;
          default:
            // console.log("Error creating user:", error);
        }
      } else {
        // Add data to table
        ref.child("users").child(userData.uid).set({
          // sentInvite: false,
          authid: userData.uid,
          email: regEmail,
          password: regPassword,
          date_created: timeInMs,
          guests: false,
          sides: false,
          attending: false,
          invited: false,
          events: initialEvents,
          wedding_date: false,
          settings: false,
          onboard: this.state.onboard
        });

        // console.log("Successfully created user account with uid:", userData.uid);

        // Create a callback to handle the result of the authentication
        function authHandler(error, authData) {
          if (error) {
            // console.log("Login Failed!", error);
          } else {
            // console.log("Authenticated successfully with payload:", authData);
            // window.location.href = '/#/dashboard';
          }
        }

        // Auth with email/password
        ref.authWithPassword({
          email    : regEmail,
          password : regPassword
        }, authHandler);
          }
        }.bind(this));

  },
  handleLogout: function() {
    ref.unauth();
    this.setState({ loggedIn: false });
  },
  handleDataLoaded: function(){
    this.setState({loaded: true});
  },
  handleRegister: function(){
    this.setState({register: true});
  },
  handleGuest: function(fname,lname,email,choices,id,action) {

    // Unique ID
    var timeInMs = Date.now();
    var randomNo = Math.floor(Math.random() * 1000) + 1;

    if(action == "add" || action == "edit") {
      var string = (fname + lname + randomNo).replace(/ /g,'').toLowerCase();
    }

    // logging("Fname",fname,false);
		// logging("Lname",lname,false);
		// // logging("Email",email,false);
		// logging(false,choices,"obj");
		// logging("Action",action,false);
		// logging("Id",id,false);

    if(action == "add") {

      // Add guest
      this.fb.child("guests/" + string).set({

        // Dates
        date_created: timeInMs,
        date_updated: false,

        // Personal info
        fname: fname,
        lname: lname,
        // email: email,
        events: choices,

        // False for later
        dietary: false, meals: false, spotify: false, side: false,

      });

			// Popup
			this.handlePopup("success",(fname + " " + lname + " added!"));

      // Add to each event - loop through events and add
      var events = {};
      {Object.keys(choices).map(function(key) {

        // Update event
        this.fb.child("events/" + key + "/guests/").update({ [string]: true });

        // Add to invited
        this.fb.child("invited/" + string).update({ [key]: true });

      }.bind(this))};
      // End event loop

    }

    // Edit guest
    if(action == "edit") {
			// console.info(choices);
			// console.info(id);
      // Add guest
      this.fb.child("guests/" + id).update({

        // Dates
        date_updated: timeInMs,

        // Personal info
        fname: fname,
        lname: lname,
        email: email

      });

			// Popup
			this.handlePopup("info",(fname + " " + lname + " updated!"));

      // Add to each event - loop through events and add
      var events = {};

				{Object.keys(this.state.user.events).map(function(key) {

					if(choices[key]) {
						// console.log("Attending " + key);
						this.fb.child("events/" + key + "/guests/").update({ [id]: true });
						this.fb.child("invited/" + id).update({ [key]: true });
						this.fb.child("guests/" + id + "/events/").update({ [key]: true });
					} else {
						// console.log("Not " + key);
						this.fb.child("events/" + key + "/guests/" + id).remove();
						this.fb.child("invited/" + id + "/" + key).remove();
						this.fb.child("guests/" + id + "/events/" + key).remove();
					}

	      }.bind(this))};
	    //   End event loop

    }

    if(action === "remove") {

			var r = confirm("Are you sure?");

				if (r == true) {

					this.fb.child("guests/" + id).remove();

					// Popup
					this.handlePopup("error",("Guest deleted"));

					// Add to each event - loop through events and add
					var events = {};

					{Object.keys(this.state.user.events).map(function(key) {

						console.log(key)

						// Remove event
						this.fb.child("events/" + key + "/guests/" + id).remove();
						this.fb.child("events/" + key + "/attending/" + id).remove();
						this.fb.child("events/" + key + "/notattending/" + id).remove();

						// Remove invited
						this.fb.child("attending/" + id).remove();
						this.fb.child("nattending/" + id).remove();


					}.bind(this))};
					// End event loop

				}

    }

  }

});

var routes = (
  <Router history={new HashHistory}>
      <Route path="/" component={App}>
        <Route path="guests" component={Guests} />
        <Route path="events" component={Events} />
        <Route path="settings" component={Settings} />
      </Route>
      <Route path="page" component={View}>
          <Route path=":userId/:guestId" component={ViewGuest} />
          <Route path=":userId" component={ViewUser} />
      </Route>
  </Router>
  )

var element = React.createElement(App, {});

React.render(routes, document.getElementById("app"));
