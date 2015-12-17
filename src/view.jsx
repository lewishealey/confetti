var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ListGuest = require('./list-guest');

module.exports = React.createClass({

	componentDidMount: function() {
	    this.setState({
	      // route components are rendered with useful information, like URL params
	      user: findUserById(this.props.params.userId)
	    })
	  },

  render: function() {
    return (
      <div>
        <h2>{this.state.user}</h2>
        {/* etc. */}
      </div>
    )
  }

});
