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
      guests: false,
      events: false,
      addGuest: false,
      eventChoices: []
    }
  },
  componentWillMount: function() {

    // Preload guest & event data
    var authData = ref.getAuth();

    var guestRef = new Firebase(rootUrl + 'users/' + authData.uid + "/guests/");

    // Bind guest
    this.bindAsObject(guestRef, 'guests');

    // Set auth as a state
    this.setState({ authId: authData.uid});

  },
  render: function() {
    return <div>

    <div className="guest__column">

            <div className="column column__half">
                    <h2>Whos attending</h2>
                </div>  

            <div className="cont row">
                <div className="column">
                  Name
                </div>
                <div className="column__double">
                  Events
                </div>
              </div>

            {this.renderList()}
          </div>
    </div>
  },
  renderList: function() {

    // Go through list of guests
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
          <ListGuest guest={this.state.guests[key]} key={key} userId={this.state.authId} attending={true}></ListGuest>
        )
      }

      return children;
    }
  }
});
