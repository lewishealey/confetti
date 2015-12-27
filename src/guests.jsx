var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

var ListGuest = require('./list-guest');

module.exports = React.createClass({
	mixins: [ReactFire],
	getInitialState: function() {
	return { 
			authId: false,
			guests: false
		}
	},
	componentWillMount: function() {
		// Get guest data
		var authData = ref.getAuth();
		var firebaseRef = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + authData.uid + "/guests/");
    	this.bindAsObject(firebaseRef, 'guests');

    	this.setState({ authId: authData.uid});
	},
	render: function() {
		return <div>
			{this.renderList()}
		</div>
	},
	renderList: function() {
		if(! this.state.guests) {
			return <h4>
			Add a guest to get started
			</h4>
		} else {
			var children = [];

			for(var key in this.state.guests) {
				var guest = this.state.guests[key];
				guest.key = key;
				children.push(
					<ListGuest guest={this.state.guests[key]} key={key} userId={this.state.authId} >
					</ListGuest>
				)
			}

			return children;
		}
	}
});
