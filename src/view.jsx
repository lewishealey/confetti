var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';

var ViewEvent = require('./view-event');

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return({
      guest: false,
      loaded: false
    })
  },
  componentWillMount: function() {

    var firebaseRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + '/guests/' + this.props.params.guestId);
    var eventRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + "/events/");

    // Bind Events, Meals & Guests to states
    this.bindAsObject(eventRef, 'events'); 
    this.bindAsObject(firebaseRef, 'guest');

  },
  componentDidMount: function() {
    this.setState({
      loaded: true,
      userId: this.props.params.userId 
    });

  },
  render: function() {

    // If component is loaded
    if(this.state.loaded && this.state.guest.events) {

      var content = Object.keys(this.state.guest.events).map(function (key, i) {

        return <ViewEvent event={this.state.events[key]} key={i} id={key} i={i} userId={this.props.params.userId} guestId={this.props.params.guestId} />
                
      }.bind(this));

    } else {

      var content = "Loading";

    }

  
  return <div className="view">

      <div className="column" style={{background : 'url("http://da-photo.co.uk/wp-content/uploads/2015/07/CS_PWS_BLOG_002.jpg")'}}>
        Photo
      </div>

      <div className="column view--white">
        <div className="column--nest">
          <h4>Welcome {this.state.guest.fname}</h4>
          <h5>Feel free to rsvp to the beautiful day</h5>

          {content}

        </div>


      </div>

    </div>

  }

});
