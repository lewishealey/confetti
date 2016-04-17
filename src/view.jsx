var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var JQuery = require('jquery');

var ViewUser = require('./view-user');
var ViewGuest = require('./view-new');

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
      user: false,
      loaded: false,
      spotify: false
    })
  },
  componentWillMount: function() {

    if(this.props.params.userId) {
      userRef = new Firebase(rootUrl + 'users/' + this.props.params.userId);
      // Bind Events, Meals & Guests to states
      this.bindAsObject(userRef, 'user');
    }

  },
  componentDidMount: function() {
    this.setState({
      loaded: true
    });

  },
  handleTrack: function(trackId) {

  },
  searchTrack: function(event) {

    spotifyApi.searchTracks(event.target.value).then(function(data) {
        if( data ) {
          this.setState({ tracks: data.tracks.items });
        }
    }.bind(this));

  },
  render: function() {

    if(this.props.params.userId && this.props.params.guestId) {
      // console.log("Guest");
    } else {
      // console.log("User");
      var content =  <ViewUser user={this.state.user} onChange={this.handleGuest} />
    }

    // If component is loaded
    // if(this.state.loaded && this.state.user) {
    //
    //   var content = Object.keys(this.state.user.invited[this.props.params.guestId]).map(function (key, i) {
    //
    //     return <ViewEvent key={i} id={key} i={i} userId={this.props.params.userId} guestId={this.props.params.guestId} />
    //
    //   }.bind(this));
    //
    // } else {
    //
    //   var content = "Loading your page";
    //
    // }


  return <div className="view">

      <div className="column" style={{background : 'url("http://da-photo.co.uk/wp-content/uploads/2015/07/CS_PWS_BLOG_002.jpg")'}}>
        Photo
      </div>

      <div className="column view--white">
        <div className="column--nest">
          <h4>Welcome {this.state.guest ? this.state.guest.fname : ''}</h4>
          <h5>Feel free to rsvp to the beautiful day</h5>

          <input type="text" refs="track search" onChange={this.searchTrack} />

          <button onClick={this.handleAccessToken}>Get access token</button>

          <div className="cont cont__flex-row">
            {content}
          </div>

          <div className="cont cont__flex-row">
            Add a song to spotify
          </div>

            {this.state.tracks &&

              Object.keys(this.state.tracks).map(function (key, i) {
                if(i < 10) {
                return <div className="cont cont__flex-row">
                    <div className="column">
                      {this.state.tracks[key].artists[0].name + " - " + this.state.tracks[key].name}
                    </div>
                    <div className="column">
                      <button onClick={this.handleTrack.bind(this,this.state.tracks[key].id)}>Choose</button>
                    </div>
                  </div>
                }

              }.bind(this))

            }

        </div>


      </div>

    </div>

  },
  // Change data
  handleGuest: function(guest, event, truth) {
    console.log(guest + event + truth);

    if(truth) {

      // Add attending object to event
      userRef.child("attending/" + guest).update({

        [event]: true

        }, function(error) { if (error) { console.log("Nope to update event" + error);  } else {

          // Success
          console.log("Attending " + guest + " " + event + " " + truth);

        } //userRef.child("attending/")

      }.bind(this));

      userRef.child("events/" + event + "/attending/").update({

          [guest]: true

          }, function(error) { if (error) { console.log("Nope to update event" + error); } else {

            // Success
            console.log("Event " + event + " " + guest + " " + truth);

          }

      }.bind(this));

      userRef.child("events/" + event + "/notattending/").remove();
      userRef.child("notattending/" + guest + "/" + event).remove();

      // Set state for new view
      this.setState({ responded: "attending" });


    } else {
      userRef.child("events/" + event + "/attending/").remove();
      userRef.child("attending/" + guest + "/" + event).remove();

      // Add attending object to event
      userRef.child("notattending/" + guest).update({

        [event]: true

        }, function(error) { if (error) { console.log("Nope to update event" + error);  } else {

          // Success
          console.log("Not attending " + guest + " " + event + " " + truth);

        } //userRef.child("attending/")

      }.bind(this));

      userRef.child("events/" + event + "/notattending/").update({

          [guest]: true

          }, function(error) { if (error) { console.log("Nope to update event" + error); } else {

            // Success
            console.log("N Event " + event + " " + guest + " " + truth);

          }

      }.bind(this));

      // Set state for new view
      this.setState({ responded: "notattending" });

    }
  }

});
