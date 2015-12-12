var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.guest.name,
      done: false,
      textChanged: false
    }
  },
  componentWillMount: function() {
    this.fb = new Firebase(rootUrl + 'users/' + this.props.userId + "/guests/" + this.props.guest.key);
  },
  render: function() {
    return <div className="input-group">
      <span className="input-group-addon">
        <input type="checkbox" checked={this.state.done} onChange={this.handleDoneChange} />
      </span>
      <input type="text"
        disabled={this.state.done}
        className="form-control"
        defaultValue={this.state.name} />
      <span className="input-group-btn">
        <button
          className="btn btn-default"
          onClick={this.handleDeleteClick}
          >
          Delete
        </button>
      </span>
    </div>
  },
  handleDoneChange: function(event) {
    var update = {done: event.target.checked}
    this.setState(update);
    this.fb.update(update);
  },
  handleDeleteClick: function() {
    this.fb.remove();
  }
});
