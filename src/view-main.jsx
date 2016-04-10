var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var JQuery = require('jquery');

var ViewEvent = require('./view-event');

// Spotify
var SpotifyWebApi = require('spotify-web-api-js');


// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '2888525482b94ccb86ae7ee9469bab07',
  clientSecret : '6df8e93ea2ba49c6ae90951fea0e2f9e',
  redirectUri : 'http://confetti:8888/#/dashboard/'
});

//https://api.spotify.com/v1/users/1113560298/playlists/7Fyg5tJ0oQdIRxLwOJ2T1g/tracks?uris=spotify%3Atrack%3A396QaHZq5gGIUS2ZicB5t1


module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return({
      guest: false,
      loaded: false,
      spotify: false
    })
  },
  componentWillMount: function() {

    // var firebaseRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + '/guests/' + this.props.params.guestId);
    // var eventRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + "/events/");
    var userRef = new Firebase(rootUrl + 'users/' + this.props.params.userId);

    this.bindAsObject(userRef, 'user');

  },
  componentDidMount: function() {
    this.setState({
      loaded: true,
      userId: this.props.params.userId
    });

  },
  handleTrack: function(trackId) {

  },
  searchTrack: function(event) {

  },
  onSearchGuest: function(e) {
    var value = e.target.value;

    if(this.state.guestSearch) {
      var currentGuest = this.state.guestSearch;
    } else {
      var currentGuest = {};
    }

    if(value.length > 2 ) {

      Object.keys(this.state.user.guests).map(function (key, i) {
        var guest = this.state.user.guests[key];
        var search = guest.fname.search(new RegExp(value));

        if(search != -1) {
          currentGuest[key] = guest;
        }

      }.bind(this))

      this.setState({ guestSearch : currentGuest });

    } else {
      var currentGuest = {};
      this.setState({ guestSearch : {} });
    }


  },
  render: function() {
    console.log(this.state.guestSearch);

  return <div className="view">

      <div className="column" style={{background : 'url("http://da-photo.co.uk/wp-content/uploads/2015/07/CS_PWS_BLOG_002.jpg")'}}>
        Photo
      </div>

      <div className="column view--white">
        <div className="column--nest">
          <h4>Welcome wq</h4>
          <h5>Feel free to rsvp to the beautiful day</h5>

              <input onChange={this.onSearchGuest} className="form-control"/>

              {this.state.guestSearch &&
                Object.keys(this.state.guestSearch).map(function (key, i) {

                  return <p>{this.state.guestSearch[key].fname + " " + this.state.guestSearch[key].lname}</p>

                }.bind(this))

              }

        </div>
      </div>

    </div>

  }

});
