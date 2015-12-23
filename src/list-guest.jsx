var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.guest.name,
      id: this.props.guest.key,
      events: this.props.guest.events
    }
  },
  componentWillMount: function() {
    this.fb = new Firebase(rootUrl + 'users/' + this.props.userId + "/guests/" + this.props.guest.key);
  },
  render: function() {
    return <div>{this.state.name} - {this.state.events} <a className="btn btn-default" target="_blank" href={("/#/view/" + this.props.userId + "/guest/" + this.state.id)}>View</a> <button className="btn btn-default" onClick={this.handleDeleteClick}>Delete</button> </div>
  },
  handleDeleteClick: function() {
    this.fb.remove();
  }
});
