var React = require('react');
var ViewGuest = require('./view-guest');

// Spotify
var SpotifyWebApi = require('spotify-web-api-js');


// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '2888525482b94ccb86ae7ee9469bab07',
  clientSecret : '6df8e93ea2ba49c6ae90951fea0e2f9e',
  redirectUri : 'http://localhost/confetti_app/#/page/'
});

count = 1;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      loaded: false,
      step: 1,
      emailState: false,
      editTrack: false
    }
  },
  componentWillMount: function() {
  },
  componentDidMount: function() {
    // console.log(this.props.user);
    this.setState({
      loaded: true
    });
  },
  handleGuest: function(guest, event, truth) {
    //Pass data up
    this.props.onChange(guest, event, truth);
  },
  render: function() {

    if(this.state.guest) {
      var content = <ViewGuest user={this.props.user} onCourseMealChange={this.onCourseMealChange} guest={this.state.guest} guestId={this.state.guest_id} onChange={this.handleGuest} />
    } else {
      var content = "Choose your guest";
    }

    return <div className="guest-select">

      <button onClick={this.onClearSearch}>Clear search</button>

        <input onChange={this.onSearchGuest} className="form-control" placeholder="Enter your name" ref="input-guest" required autoComplete="fname" />

      {this.state.guestSearch  &&

        <ul className="guest-list">
        {Object.keys(this.state.guestSearch).map(function (key, i) {

          return <li className="guest-list__item" onClick={this.onSelectGuest.bind(this, this.state.guestSearch[key], key)}>{this.state.guestSearch[key].fname + " " + this.state.guestSearch[key].lname} <span className="guest-list__select">That's me</span></li>

        }.bind(this))}

      </ul>

      }

      <div className="cont cont__flex-column">
      {(this.state.guest_id) && //&& !this.state.guest.email
        <div className="column">
            <div>
              <h4>Please enter your email address</h4>
              <p>This is so the happy couple can make announcements about anything important with the wedding.</p>
                <input onChange={this.onInputEmail} className={"form-control " + (this.state.emailState && this.state.emailState == true ? 'success' : 'error')}  placeholder="Enter your email address" ref="guestEmail" name="email" />
                <small>We DO NOT use your email address for anything apart from communicating with the happy couple. We will actually delete your email from our records post-wedding.</small>
                  <button onClick={this.onHandleEmail}>Proceed</button>
            </div>
          {this.props.handleEmailState ? this.props.handleEmailState : ''}
        </div>

      }

          <div className="column">
            {content}
          </div>

        <div className="column">
          {this.state.guest_id &&
            <p><strong>Tip: </strong>You can visit this link whenever you want to update your status if things change. Save this website {"http://localhost/confetti_app/#/" + this.props.userId + "/" + this.state.guest_id}</p>
          }
        </div>

        {(this.state.guest_id && !this.state.editTrack) &&
          <div className="cont cont__flex-row">
            Add a song to spotify
            <input type="text" className="form-control" placeholder="Search for a track" onChange={this.searchTrack}/>
          </div>
        }

          {(this.state.tracks && this.state.guest_id) &&

            Object.keys(this.state.tracks).map(function (key, i) {
              if(i < 10) {
              return <div className="cont cont__flex-row">
                  <div className="column">
                    {this.state.tracks[key].artists[0].name + " - " + this.state.tracks[key].name}
                  </div>
                  <div className="column">
                    <button onClick={this.handleTrack.bind(this,this.state.tracks[key])}>Choose</button>
                  </div>
                </div>
              }

            }.bind(this))

          }

          {(this.props.user.playlist && this.state.guest_id && this.props.user.playlist[this.state.guest_id]) &&
            <div>
              <h4>Added a track!</h4>
              <div className="row">
                <div className="col-md-3">
                  <img src={this.props.user.playlist[this.state.guest_id].album_image} style={{width: "100%"}}/>
                </div>
                <div className="col-md-9">
                  {this.props.user.playlist[this.state.guest_id].artist_name} - {this.props.user.playlist[this.state.guest_id].track_name}
                </div>
              </div>

              <button onClick={this.onEditTrack}>Change your suggestion</button>

            </div>
          }

      </div>

    </div>
  },
  onInputEmail: function(e) {

    var value = e.target.value;
    if(isEmail(value)) {
      this.setState({ emailState: true });
    } else {
      this.setState({ emailState: "Not valid" });
    }

  },
  onHandleEmail: function(e) {
    // Pass email address and guest ID up to source of truth
    var value = this.refs.guestEmail.getDOMNode().value;

    if(isEmail(value)) {
        // Pass data up to be saved
        this.props.handleEmail(value,this.state.guest_id);

        // Set the step
        this.setState({
          step: 3
        });

     } else {
       alert("Incorrect email address");
     }

  },
  onClearSearch: function() {

    this.setState({
      guest: false,
      guest_id: false,
      guestSearch: false,
      step: 1
    });

  },
  onSearchGuest: function(e) {
    var value = e.target.value;
    // var re = new RegExp('\\b'+value+'\\b','i');
    var re = new RegExp(value,'i');

    if(this.state.guestSearch) {
      var currentGuest = this.state.guestSearch;
    } else {
      var currentGuest = {};
    }

    if(value.length > 2 ) {

      Object.keys(this.props.user.guests).map(function (key, i) {
        var guest = this.props.user.guests[key];
        var search = (guest.fname + " " + guest.lname).search(re);

        // console.log(guest.fname + " - " + search);

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
  onCourseMealChange: function(mealName, courseName, eventName, guestName) {
    this.props.onCourseMealChange(mealName, courseName, eventName, guestName);
  },
  onSelectGuest: function(guestData, key) {

    this.setState({
      guest : guestData,
      guest_id: key,
      guestSearch: false,
      step: 2
    });

  },
  onEditTrack: function() {
    this.setState({ editTrack: !this.state.editTrack });
  },
  handleTrack: function(trackData) {
    this.setState({ editTrack: !this.state.editTrack });

    //Pass props up
    this.props.handleTrack(this.state.guest_id,trackData.artists[0].name,trackData.name,trackData.album.images[0].url,trackData.external_urls.spotify,trackData.id,trackData.uri);
  },
  searchTrack: function(event) {

    spotifyApi.searchTracks(event.target.value).then(function(data) {
        if( data ) {
          this.setState({ tracks: data.tracks.items });
        }
    }.bind(this));

  }

});

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
