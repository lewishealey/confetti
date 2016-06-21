var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');

// Spotify
var SpotifyWebApi = require('spotify-web-api-js');


// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '2888525482b94ccb86ae7ee9469bab07',
  clientSecret : '6df8e93ea2ba49c6ae90951fea0e2f9e',
  redirectUri : 'http://localhost/confetti_app/#/page/'
});

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return({
      loaded: false,
      editTrack: false,
      addSpotify: false
    })
  },
  componentWillMount: function() {
  },
  componentDidMount: function() {
    this.setState({
      loaded: true
    })
  },
  componentWillReceiveProps: function() {
  },
  render: function() {

    if(this.props.user.invited[this.props.guestId] && this.state.loaded) {

      var eventClass = {};

      return <div>

            <div className="row">

              <div className="col-md-6">
                <h4 className="title title--no-margin">Hello {this.props.user.guests[this.props.guestId].fname + " " + this.props.user.guests[this.props.guestId].lname}, RSVP below</h4>
              </div>

              <div className="col-md-6 tar view__unique-link">
                Unique link: {"http://jephwed.co.uk/" + this.props.guestId}
              </div>

            </div>


        <div className="row flex">

        {Object.keys(this.props.user.invited[this.props.guestId]).map(function (key, i) {

          var eventKey = key;
          eventClass[eventKey] = false;

          if(this.props.user.attending && this.props.user.attending[this.props.guestId] && this.props.user.attending[this.props.guestId].events && this.props.user.attending[this.props.guestId].events[key]) {
            eventClass[eventKey] = "attending";
          }

          if(this.props.user.notattending && this.props.user.notattending[this.props.guestId] && this.props.user.notattending[this.props.guestId].events && this.props.user.notattending[this.props.guestId].events[key]) {
            eventClass[eventKey] = "nattending";
          }

          // console.log(eventClass);

            return <div className={"col-md-6 event__single flex " + eventClass[key]} key={i}>

              {! eventClass[eventKey] &&

                      <div className="column--nest">

                        <div className="column cont">
                          <div className="column__half-width">
                            <h4 className="event__title">{this.props.user.events ? this.props.user.events[key].name : ''}</h4>
                          </div>

                          <div className="column__half-width tar">
                            {this.props.user.events[key].to &&
                              <p>
                                {this.props.user.events[key].from + " - " + this.props.user.events[key].to}
                              </p>
                            }
                          </div>
                        </div>

                        {this.props.user.events[key].address &&
                          <div className="column">
                            <p className="sub">
                              {this.props.user.events[key].address + ", " + this.props.user.events[key].postcode}<br />
                            <a href="#">View on map</a>
                            </p>
                          </div>
                        }

                        <div className="column">
                          <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b" onClick={this.handleAttending.bind(this,this.props.guestId,key,true)}>Attending</a>
                          <a className="btn btn--outline btn--icon btn--icon-cross btn--m-b" onClick={this.handleAttending.bind(this,this.props.guestId,key,false)}>Not Attending</a>
                        </div>

                      </div>

                  }

                  {eventClass[eventKey] == "attending" &&
                    <div className="column">
                      <div className="column--nest">

                        <div className="column cont">
                          <div className="row">
                            <div className="col-md-12">
                              <h4 className="event__title event--attending">You're attending</h4>

                            <h4>{this.props.user.events[key].name}</h4>
                              {this.props.user.events[key].to &&
                                <p>
                                  {this.props.user.events[key].to + " - " + this.props.user.events[key].from}
                                </p>
                                }
                              <p>How exciting! We've sent you and the couple an email to clarify everything.</p>
                            </div>
                          </div>

                          <div className="event__attending-icon">
                            <i className="material-icons">done</i>
                          </div>

                        </div>

                      {this.props.user.courses && this.props.user.courses[key] &&
                        <div>

                          <h4>Select your meals for {this.props.user.events[key].name}</h4>

                          {Object.keys(this.props.user.courses[key]).map(function (course, i) {

                            return <div>

                              <label key={i}>{this.props.user.courses[key][course].name}</label>
                            {(this.props.user.courses[key][course] && this.props.user.courses[key][course].meals) &&

                              <p>
                                <select className="form-control" onChange={this.handleCourseMeal.bind(this,course,key,this.props.guestId )}>
                                <option>{(this.props.user.attending[this.props.guestId].events[key].courses && this.props.user.attending[this.props.guestId].events[key].courses[course]) ? this.props.user.courses[key][course].meals[this.props.user.attending[this.props.guestId].events[key].courses[course].meal_name].name  : "Select a meal option"}</option>
                                {Object.keys(this.props.user.courses[key][course].meals).map(function (meal, i) {
                                  return <option key={meal} value={meal}>{this.props.user.courses[key][course].meals[meal].name}</option>
                                }.bind(this))}
                              </select>
                            </p>

                            }


                            </div>


                          }.bind(this))}

                        </div>
                    }

                    <p><a onClick={this.handleAttending.bind(this,this.props.guestId,key,false)}>I cannot attend</a></p>

                  </div>
                </div>
                  }

                  {eventClass[eventKey] == "nattending" &&
                    <div className="column">
                      <div className="column--nest">

                        <div className="column cont">
                          <div className="column__half-width">
                            <h4 className="event__title event--nattending">Not Attending</h4>
                          </div>

                          <div className="event__nattending-icon">
                            <i className="material-icons">clear</i>
                          </div>

                        </div>

                        <h4>{this.props.user.events[key].name}</h4>
                        <p>Oh no! you can't attend :(</p>
                        <a onClick={this.handleAttending.bind(this,this.props.guestId,key,true)}>I can attend now</a>
                      </div>
                  </div>
                  }

                </div>

        }.bind(this))}

        </div>

        <span className="line"></span>

        <div className="row">

          <div className="col-md-6">
            <h4 className="title title--no-margin">Suggest a song <img src="http://res.cloudinary.com/dtavhihxu/image/upload/v1466015803/play-with_hmyqe6.png" width="110" /></h4>
            <button className="btn btn--spotify" onClick={this.addSpotify}>Add song to wedding playlist</button>

          {this.state.addSpotify &&

            <div className={"add " + (this.state.addSpotify ? "active" : "not")}>

                <div className="add__main">

                  <img className="add__close" src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/close.png?alt=media&token=a2250bd0-d07a-4ffc-b10b-cf9c08566932" onClick={this.addSpotify} />

                  <div className="row">

                    <div className="col-md-8">
                      <h4>Search for a track</h4>
                      <input type="text" className="form-control" placeholder="Type a track or artist name" onChange={this.searchTrack}/>

                      {(this.state.tracks && this.props.guestId) &&

                        <div className="guest-list">

                          {Object.keys(this.state.tracks).map(function (key, i) {

                            if(i < 10) {
                            return <div className="guest-list__item" onClick={this.handleTrack.bind(this,this.state.tracks[key])}>
                                  {this.state.tracks[key].artists[0].name + " - " + this.state.tracks[key].name}
                                  <a> select</a>
                              </div>
                            }

                          }.bind(this))}

                        </div>

                      }

                    </div>
                  </div>

                  <div className="row">

                      <div className="col-md-12 add__cta">
                        Search for anything you want!
                      </div>

                  </div>

                </div>

            </div>

          }

          </div>

          <div className="col-md-6 view__chosen-track">
            {(this.props.user.playlist && this.props.guestId && this.props.user.playlist[this.props.guestId]) &&
              <div>
                <div className="row">
                  <div className="col-xs-6 col-md-3">
                    <img src={this.props.user.playlist[this.props.guestId].album_image} style={{width: "100%"}}/>
                  </div>
                  <div className="col-xs-6 col-md-9">
                    <span className="sub">Your track</span>
                      <h4>{this.props.user.playlist[this.props.guestId].artist_name} - {this.props.user.playlist[this.props.guestId].track_name}</h4>
                      <p><a onClick={this.addSpotify}>Change track</a></p>
                  </div>
                </div>



              </div>
            }
          </div>


        </div>

      </div>

    } else {
      return <div>
        Sorry you are not invited to anything yet
      </div>
    }

  },
  addSpotify: function() {
    this.setState({ addSpotify: !this.state.addSpotify });
  },
  handleCourseMeal: function(courseName, eventName, guestName , event) {
    var mealName = event.target.value;

    this.props.onCourseMealChange(mealName, courseName, eventName, guestName);
  },
  handleAttending: function(guest, event, truth) {
      this.props.onChange(guest, event, truth);
  },
  onEditTrack: function(event) {
    event.preventDefault();
    this.setState({ editTrack: !this.state.editTrack });
  },
  handleTrack: function(trackData,event) {
    event.preventDefault();

    this.setState({
      editTrack: !this.state.editTrack,
      addSpotify: !this.state.addSpotify
    });

    // console.log(trackData)

    //Pass props up
    this.props.handleTrack(this.props.guestId,trackData.artists[0].name,trackData.name,trackData.album.images[0].url,trackData.external_urls.spotify,trackData.id,trackData.uri);
  },
  searchTrack: function(event) {

    spotifyApi.searchTracks(event.target.value).then(function(data) {
        if( data ) {
          this.setState({ tracks: data.tracks.items });
        }
    }.bind(this));

  }

});
