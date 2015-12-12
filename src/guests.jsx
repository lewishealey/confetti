var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ListGuest = require('./list-guest');

module.exports = React.createClass({

	render: function() {
		return <div>
			{this.renderList()}
		</div>
	},
	renderList: function() {
		if(! this.props.guests) {
			return <h4>
			Add a todo to get started
			</h4>
		} else {
			var children = [];

			for(var key in this.props.guests) {
				var guest = this.props.guests[key];
				guest.key = key;
				children.push(
					<ListGuest guest={this.props.guests[key]} key={key} userId={this.props.userId} >
					</ListGuest>
				)
			}

			return children;
		}
	}
});
