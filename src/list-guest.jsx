var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
  return {  
    events: false,
    edit: false
    }
  },
  componentWillMount: function() {
      this.fb = new Firebase(rootUrl + 'users/' + this.props.userId + "/guests/" + this.props.guest.key);
      var eventRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/events/");
      this.bindAsObject(eventRef, 'events'); 
  },
  render: function() {
    
              return <div className="guest__container">
                <div className="guest__column">
                  {this.props.guest.fname + " " + this.props.guest.lname}
                </div>
                <div className="guest__column">

                {this.props.guest.events &&
                  Object.keys(this.props.guest.events).map(function (event) {
                    return <span> {this.state.events[event].name} </span>
                  }.bind(this))
                }

                </div>
                <div className="guest__column">
                  <a href={"/#/view/" + this.props.userId + "/guest/" + this.props.guest.key} target="blank">View page</a> 
                </div>
                <div className="guest__column">
                  <a onClick={this.handleEditClick}>Edit</a> 
                </div>
                <div className="guest__column">
                  <a onClick={this.handleDeleteClick}>Delete</a> 
                </div>
              </div>

            
  },
  handleEditClick: function() {

  },
  handleDeleteClick: function(e) {
    e.preventDefault();
    this.fb.remove();
  }
});
