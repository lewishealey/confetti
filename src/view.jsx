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
    return (
      <div>
        <h2>{this.state.guest.name}</h2>
      </div>
    )
  }

});
