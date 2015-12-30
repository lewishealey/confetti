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
    var firebaseRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + '/guests/' + this.props.params.guestId);
    var eventRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + "/events/");
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + "/meals/");

    // Bind Events, Meals & Guests to states
    this.bindAsObject(eventRef, 'events'); 
    this.bindAsObject(firebaseRef, 'guest');
    this.bindAsObject(mealRef, 'meals');

  },
  componentDidUpdate: function() {
    console.log(this.state.guest);
  },
  render: function() {
  
  return <div className="view">

      <div className="column">
        Photo
      </div>

      <div className="column view--white">
        <h4>Welcome {this.state.guest.fname}</h4>
        <h5>Feel free to rsvp to the beautiful day</h5>

        {this.state.guest.events &&

            Object.keys(this.state.guest.events).map(function (key, i) {

              return <div key={i} className="view__event"> 
                  
                <h4>{this.state.events[key].name}</h4>
                <p>{this.state.events[key].address} {this.state.events[key].postcode}</p>

                <img src={"http://maps.googleapis.com/maps/api/staticmap?center=" + this.state.events[key].postcode + "&zoom=16&size=500x500&markers=" + this.state.events[key].postcode + "&sensor=false"} width="200" height="200" />

                {this.state.events[key].meals &&

                  Object.keys(this.state.events[key].meals).map(function (mKey, i) {

                      if(this.state.meals[mKey]) {

                        return <div key={i}>{this.state.meals[mKey].name}</div>

                      }

                  }.bind(this))

                }

              </div>

            }.bind(this))
 
          }


      </div>

    </div>

  },
  handleAttending: function() {

  },
  handleNotAttending: function() {

  }

});
