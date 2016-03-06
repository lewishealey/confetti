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
      eventChoices: [],
      user: false
    }
  },
  componentWillMount: function() {

    // Preload guest & event data
    var authData = ref.getAuth();

    var guestRef = new Firebase(rootUrl + 'users/' + authData.uid + "/guests/");
    userRef = new Firebase(rootUrl + 'users/' + authData.uid);

    // Bind guest
    this.bindAsObject(guestRef, 'guests');
    this.bindAsObject(userRef, 'user');

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
    if(this.state.user) {
      console.log(this.state.user.attending);
    }

    // Go through list of guests
    if(! this.state.user.attending) {
      return <h4>
        No one is attending :(, Add a guest to get started
      </h4>
    } else {
      var children = [];

      for(var key in this.state.user.attending) {
        var guest = this.state.user.guests[key];
        guest.key = key;
        children.push(
          <ListGuest guest={this.state.user.guests[key]} key={key} userId={this.state.authId} attending={true}></ListGuest>
        )
      }

      return children;
    }
  }
});
