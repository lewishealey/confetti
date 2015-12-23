var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return({
      guest: false
    })
  },
  componentWillMount: function() {
    var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.props.params.userId + "/guests/" + this.props.params.guestId);
    this.bindAsObject(firebaseRef, 'guest');

  },
  render: function() {

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

});
