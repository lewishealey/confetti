var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

var Spotify = require('spotify-web-api-js');
var s = new Spotify();
var spotifyApi = new SpotifyWebApi();

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '2888525482b94ccb86ae7ee9469bab0',
  clientSecret : '6df8e93ea2ba49c6ae90951fea0e2f9e',
  redirectUri : 'http://confetti:8888/#/dashboard/settings'
});

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
  return { 

    }
  },
  componentWillMount: function() {

    // Preload guest & event data
    var authData = ref.getAuth();
    this.fb = new Firebase(rootUrl + 'users/' + authData.uid);

    // get Elvis' albums, passing a callback. When a callback is passed, no Promise is returned
    spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function(err, data) {
      if (err) console.error(err);
      else console.log('Artist albums', data);
    });

  },
  render: function() {
    return <div>

    <h4>Hello</h4>

    </div>
  },
  handleClick: function() {

  }

});
