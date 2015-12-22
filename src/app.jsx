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
var Dashboard = require('./dashboard');
var ref = new Firebase(rootUrl);

var App = React.createClass({
  mixins: [ ReactFire ],
  getInitialState: function() {
    return {
      register: false
    }
  },
  componentWillMount: function() {
    
    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
      } else {
        console.log("User is logged out");
      }
    }
    // Register the callback to be fired every time auth state changes
    ref.onAuth(authDataCallback);

  },
  render: function() {
    var authData = ref.getAuth();
    
    if (authData) {
      return <Dashboard userId={authData.uid} onLogout={this.handleLogout} />
    } else {

      return <div><h4>Logged Out</h4>

        <label>Email</label>
        <input type="email" ref="email" name="email" />
 
        <label>Password</label>
        <input type="password" ref="password" name="password"/>

        <button onClick={this.onLoginSubmit}>Login</button>
        <a href="#" onClick={this.handleLogout}>Logout</a>
        <a href="#" onClick={this.handleRegister}>Register</a>

        <h4>Register</h4>

        <label>Email</label>
        <input type="email" ref="regEmail" name="email" />
 
        <label>Password</label>
        <input type="password" ref="regPassword" name="password"/>

        <button onClick={this.onRegisterSubmit}>Login</button>
        
        </div> 
    }

  },
  onLoginSubmit: function(e) {
    var timeInMs = Date.now();
    e.preventDefault();

    // Create a callback to handle the result of the authentication
    function authHandler(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    }

    // Auth with email/password
    ref.authWithPassword({
      email    : this.refs.email.getDOMNode().value,
      password : this.refs.password.getDOMNode().value
    }, authHandler);

    // Set logged in state
    ref.onAuth(function(authData) {
      this.setState({ loggedIn: true });
    }.bind(this));

  },
  onRegisterSubmit: function() {
    var timeInMs = Date.now();

    ref.createUser({
      email: this.refs.regEmail.getDOMNode().value,
      password: this.refs.regPassword.getDOMNode().value
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
          invited: false,
          email: this.refs.regEmail.getDOMNode().value,
          password: this.refs.regPassword.getDOMNode().value,
          date_created: timeInMs,
          sides: false,
          events: false
        });
        console.log("Successfully created user account with uid:", userData.uid);
      }
    }.bind(this));

  },
  handleDataLoaded: function(){
    this.setState({loaded: true});
  },
  handleRegister: function(){
    this.setState({register: true});
  },
  handleLogout: function() {
    ref.unauth();
    this.setState({ loggedIn: false });
  }

});

var routes = (
  <Router history={new HashHistory}>
    <Route path="/" component={App}>
        <Route path="/dashboard" component={Dashboard} />
      </Route>
    <Route path="/view/:userId/guest/:guestId" component={View} />

  </Router>
  )

var element = React.createElement(App, {});

React.render(routes, document.body);