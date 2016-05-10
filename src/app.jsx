var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';

// Router Shiz
var HashHistory = require('react-router/lib/hashhistory');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

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

var App = React.createClass({
  mixins: [ ReactFire ],
  getInitialState: function() {
    return {
      register: false,
      loggedIn: false,
      loaded: false
    }
  },
  componentWillMount: function() {

    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        // window.location.href = '/#/dashboard';
      } else {
        console.log("User is logged out");
      }
    }
    // Register the callback to be fired every time auth state changes
    ref.onAuth(authDataCallback);

  },
  render: function() {
    var authData = ref.getAuth();

    // If user is logged in show dashboard
    if (authData) {

      return <div><Dashboard>{this.props.children}</Dashboard></div>

    } else {

    // Else show login or register form
      return <div className="login">
        <div className="column--nest">
              <Login login={this.onLoginSubmit} loading={this.state.loaded} />
              <Register register={this.onRegisterSubmit} loading={this.state.loaded} />
            </div>
        </div>
    }

  },
  onLoginSubmit: function(userEmail,userPassword) {
    var timeInMs = Date.now();

    // Create a callback to handle the result of the authentication
    function authHandler(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
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

    ref.createUser({
      email: regEmail,
      password: regPassword
    }, function(error, userData) {
      // Check data
      if (error) {
        switch (error.code) {
          case "EMAIL_TAKEN":
            console.log("The new user account cannot be created because the email is already in use.");
            break;
          case "INVALID_EMAIL":
            console.log("The specified email is not a valid email.");
            break;
          default:
            console.log("Error creating user:", error);
        }
      } else {
        // Add data to table
        ref.child("users").child(userData.uid).set({
          sentInvite: false,
          onboard_1: false,
          onboard_2: false,
          onboard_3: false,
          email: regEmail,
          password: regPassword,
          date_created: timeInMs,
          guests: false,
          sides: false,
          attending: false,
          invited: false,
          events: initialEvents,
          wedding_date: false,
          settings: false
        });
        console.log("Successfully created user account with uid:", userData.uid);

        // Create a callback to handle the result of the authentication
        function authHandler(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
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
  handleDataLoaded: function(){
    this.setState({loaded: true});
  },
  handleRegister: function(){
    this.setState({register: true});
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
