var React = require('react');
var Listuser = require('./list-user');

module.exports = React.createClass({
	render: function() {
		return <div>
			{this.renderList()}
		</div>
	},
	renderList: function() {
		if(! this.props.users) {
			return <h4>
			Add a todo to get started
			</h4>
		} else {
			var children = [];

			for(var key in this.props.users) {
				var user = this.props.users[key];
				user.key = key;
				children.push(
					<Listuser 
					user={this.props.users[key]}
					key={key}
					>
					</Listuser>
				)
			}

			return children;
		}
	}
});
