var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';

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

var prev = null;

function onUserInput(queryTerm) {

  spotifyApi.searchTracks(queryTerm)
  .then(function(data) {
    console.log('Search by ' + queryTerm, data);
  }, function(err) {
    console.error(err);
  });

}


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
  searchTrack: function(event) {
    var value = event.target.value;
    onUserInput(value);
  },
  render: function() {

    // If component is loaded
    if(this.state.loaded && this.state.guest.events) {

      var content = Object.keys(this.state.guest.events).map(function (key, i) {

        return <ViewEvent key={i} id={key} i={i} userId={this.props.params.userId} guestId={this.props.params.guestId} />
                
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

          <input type="text" refs="track search" onChange={this.searchTrack} />

          <div className="cont cont__flex-row">
            {content}
          </div>

        </div>


      </div>

    </div>

  }

});
