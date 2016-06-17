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
  render: function() {

    return <div><h4>Logged Out</h4>

        <label>Email</label>
        <input type="email" ref="email" name="email" />
 
        <label>Password</label>
        <input type="password" ref="password" name="password"/>

        <button onClick={this.onLoginSubmit}>Login</button>
        <a href="#" onClick={this.handleLogout}>Logout</a>
        <a href="#" onClick={this.handleRegister}>Register</a>

        </div> 

        <form>
          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" ref="email" name="email" />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" ref="password" name="password"/>
          </div>
          <button type="submit" className="btn btn-default" onClick={this.props.login}>Submit</button>
        </form>

});
