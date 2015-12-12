var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';

module.exports = React.createClass({
	mixins: [ReactFire],
	getInitialState: function() {
	return { users: {} }
	},
	componentWillMount: function() {
		// Get user data
		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.props.userId);
    	this.bindAsObject(firebaseRef.limitToLast(25), 'users');
	},
	render: function() { 
		console.log(this.state.users);

		return <div>
			<h4>Hello {this.props.email}</h4>
			<p>{this.props.userId} {this.state.users.email}</p>
			<a href="#" onClick={this.props.onLogout}>Logout</a>
		</div>
	}, 
})


// Mixin is group of methods that sits on one object and is pasted onto new component