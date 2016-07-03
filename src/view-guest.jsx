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

function sortEvents(data) {

  var array = [];

  Object.keys(data).map(function (key, i) {
    array.push({id: key, date_created: data[key].date_created });
  });

  array.sort(function(a, b) {
    return a.date_created - b.date_created;
  });

  return array;

}

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return({
      loaded: false,
      editTrack: false,
      addSpotify: false,
      edit: [],
      courses: [],
      hasCourses: [],
      hasSubmittedCourses: []
    })
  },
  componentWillMount: function() {

    var hasCourses = this.state.hasCourses;
    var hasSubmittedCourses = this.state.hasSubmittedCourses;
    var edit = this.state.edit;

    {Object.keys(this.props.user.invited[this.props.guestId]).map(function (key, i) {

      if(this.props.user.courses && this.props.user.courses[key]) {
        hasCourses[key] = true;
      } else {
        hasCourses[key] = false;
      }

      if((this.props.user.attending[this.props.guestId] && this.props.user.attending[this.props.guestId].events && this.props.user.attending[this.props.guestId].events[key] && this.props.user.attending[this.props.guestId].events[key].courses) || (this.props.user.notattending[this.props.guestId] && this.props.user.notattending[this.props.guestId].events && this.props.user.notattending[this.props.guestId].events[key] && this.props.user.notattending[this.props.guestId].events[key].courses)) {
        hasSubmittedCourses[key] = true;
      } else {
        hasSubmittedCourses[key] = false;

        // Trigger edit
        edit[key] = true;
      }

    }.bind(this))};


    this.setState({
      loaded: true,
      hasCourses: hasCourses,
      hasSubmittedCourses: hasSubmittedCourses,
      edit: edit
    });


  },
  componentDidMount: function() {

  },
  componentWillReceiveProps: function(nextprops) {



  },
  handleClearSearch: function() {
    this.props.handleClear("hello");
  },
  handlePopup: function(type,text) {
    this.props.handlePopup(type,text);
  },
  sortCourse: function() {



  },
  render: function() {
    if(this.props.user.invited[this.props.guestId] && this.state.loaded) {

      var eventClass = {};

      return <div>

        {this.state.addSpotify &&

          <div className={"add " + (this.state.addSpotify ? "active" : "not")}>

              <div className="add__main">

                <img className="add__close" src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/close.png?alt=media&token=a2250bd0-d07a-4ffc-b10b-cf9c08566932" onClick={this.addSpotify} />

                <div className="row">

                  <div className="col-md-8">
                    <h4 class="add__title">Search for a track</h4>
                    <input type="text" className="form-control" placeholder="Type a track or artist name" onChange={this.searchTrack}/>

                    {(this.state.tracks && this.props.guestId) &&

                      <div className="guest-list">

                        {Object.keys(this.state.tracks).map(function (key, i) {

                          if(i < 10) {
                          return <div className="guest-list__item" onClick={this.handleTrack.bind(null,this.state.tracks[key])}>
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


            <div className="row">

              <div className="col-sm-6 col-md-6">
                <h4 className="title title--no-margin">Hello {this.props.user.guests[this.props.guestId].fname + " " + this.props.user.guests[this.props.guestId].lname}, RSVP below.</h4>
              </div>

            </div>


        <div className="row flex">

        {Object.keys(this.props.user.invited[this.props.guestId]).map(function (key, i) {

          this.props.user.courses[key] ? sortEvents(this.props.user.courses[key]) : "";

          var eventKey = key;
          eventClass[eventKey] = false;

          if(this.props.user.attending && this.props.user.attending[this.props.guestId] && this.props.user.attending[this.props.guestId].events && this.props.user.attending[this.props.guestId].events[key]) {
            eventClass[eventKey] = "attending";
          }

          if(this.props.user.notattending && this.props.user.notattending[this.props.guestId] && this.props.user.notattending[this.props.guestId].events && this.props.user.notattending[this.props.guestId].events[key]) {
            eventClass[eventKey] = "nattending";
          }

          // console.log(eventClass);

            return <div className={"col-sm-6 col-md-6 event__single flex " + eventClass[key]} key={i}>

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
                          <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b" onClick={this.handleAttending.bind(null,this.props.guestId,key,true)}>Attending</a>
                          <a className="btn btn--outline btn--icon btn--icon-cross btn--m-b" onClick={this.handleAttending.bind(null,this.props.guestId,key,false)}>Not Attending</a>
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
                              {this.props.user.events[key].address &&
                                <div className="column">
                                  <p className="sub">
                                    {this.props.user.events[key].address + ", " + this.props.user.events[key].postcode}<br />
                                  </p>
                                </div>
                              }
                              {this.props.user.events[key].to &&
                                <p>
                                  {this.props.user.events[key].from + " - " + this.props.user.events[key].to}
                                </p>
                                }
                              <p>How exciting! We've sent you and the couple an email to clarify everything.</p>
                            </div>
                          </div>

                          <div className="event__attending-icon">
                            <i className="material-icons">done</i>
                          </div>

                        </div>

                      {this.state.edit[eventKey] && this.state.hasCourses[eventKey] &&
                        <div>

                          <h4>Select your meals for {this.props.user.events[key].name}</h4>

                          {sortEvents(this.props.user.courses[key]).map(function(course, i) {

                            return <div>

                              <label key={i}>{this.props.user.courses[key][course.id].name}</label>
                            {(this.props.user.courses[key][course.id] && this.props.user.courses[key][course.id].meals) &&

                              <p>
                                <select className="form-control" onChange={this.handleCourseMeal.bind(this,course.id,key,this.props.guestId )}>
                                <option>{(this.props.user.attending[this.props.guestId].events[key].courses && this.props.user.attending[this.props.guestId].events[key].courses[course.id]) ? this.props.user.courses[key][course.id].meals[this.props.user.attending[this.props.guestId].events[key].courses[course.id].meal_name].name  : "Select a meal option"}</option>
                                {Object.keys(this.props.user.courses[key][course.id].meals).map(function (meal, i) {

                                  var hasMeals;

                                  // If the attending guest to event has meals
                                  if(this.props.user.attending[this.props.guestId].events[key].courses && this.props.user.attending[this.props.guestId].events[key].courses[course.id]) {
                                    hasMeals = true;
                                  } else {
                                    hasMeals = false;
                                  }

                                  if(hasMeals) {

                                    if(meal !== this.props.user.attending[this.props.guestId].events[key].courses[course.id].meal_name) {
                                      return <option key={meal} value={meal}>{this.props.user.courses[key][course.id].meals[meal].name}</option>
                                    }

                                  } else {
                                    return <option key={meal} value={meal}>{this.props.user.courses[key][course.id].meals[meal].name}</option>
                                  }




                                }.bind(this))}

                              </select>
                            </p>

                            }

                            </div>


                          }.bind(this))}

                          <p><a className={"btn btn--gold"} onClick={this.handleSave.bind(null,key)}>Save</a></p>

                        </div>
                    }

                    {!this.state.edit[eventKey] && this.state.hasCourses[eventKey] &&
                      <div>
                            {sortEvents(this.props.user.courses[key]).map(function(course, i) {

                              return <div>

                                <label key={i}>{this.props.user.courses[key][course.id].name}</label>
                                  {(this.props.user.courses[key][course.id] && this.props.user.courses[key][course.id].meals) &&

                                    <p>
                                      {(this.props.user.attending[this.props.guestId].events[key].courses && this.props.user.attending[this.props.guestId].events[key].courses[course.id]) ? this.props.user.courses[key][course.id].meals[this.props.user.attending[this.props.guestId].events[key].courses[course.id].meal_name].name  : "Select a meal option"}
                                    </p>

                                  }
                              </div>


                            }.bind(this))}
                            <p><a className={"btn"} onClick={this.handleEdit.bind(null,key)}>Edit</a></p>
                    </div>
                    }

                    <p><a onClick={this.handleAttending.bind(null,this.props.guestId,key,false)}>I cannot attend</a></p>

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
                        <a onClick={this.handleAttending.bind(null,this.props.guestId,key,true)}>I can attend now</a>
                      </div>
                  </div>
                  }

                </div>

        }.bind(this))}

        </div>

        <span className="line"></span>

        <div>

          <div className="suggest">
            <h4 className="suggest__title">Suggest a song <img src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/powered_by.png?alt=media&token=7e25b8a6-07a0-4829-b8c7-386e52c5d826" width="140" /></h4>
            <button className="btn btn--spotify" onClick={this.addSpotify}>Add song to wedding playlist</button>

              {(this.props.user.playlist && this.props.guestId && this.props.user.playlist[this.props.guestId]) &&
                <div className="row">
                <div className="col-sm-offset-2 col-sm-8 col-md-8 col-md-offset-2">

                  <div className="row suggest__track">
                    <div className="col-xs-4 col-md-4">
                      <img src={this.props.user.playlist[this.props.guestId].album_image} style={{width: "100%"}}/>
                    </div>
                    <div className="col-xs-8 col-md-8">
                      <span className="sub">Your track</span>
                        <h4>{this.props.user.playlist[this.props.guestId].artist_name} - {this.props.user.playlist[this.props.guestId].track_name}</h4>
                        <p><a onClick={this.addSpotify}>Change track</a></p>
                    </div>
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
  handleSave: function(id) {
    var edit = this.state.edit;

    var courses = this.state.courses;
    var hasCourses = this.state.hasCourses;
    var hasSubmittedCourses = this.state.hasSubmittedCourses;

    var edit = this.state.edit;

    if(edit[id]) {
      delete edit[id];
      this.handlePopup("success","Saved!");
    } else {
      edit[id] = true;
    }

    {Object.keys(this.state.courses).map(function (course, i) {
      this.props.onCourseMealChange(this.state.courses[course].mealName, this.state.courses[course].courseName, this.state.courses[course].eventName, this.state.courses[course].guestName);
    }.bind(this))};

    {Object.keys(this.props.user.invited[this.props.guestId]).map(function (key, i) {

      if(this.props.user.courses && this.props.user.courses[key]) {
        hasCourses[key] = true;
      } else {
        hasCourses[key] = false;
      }

      if((this.props.user.attending[this.props.guestId] && this.props.user.attending[this.props.guestId].events && this.props.user.attending[this.props.guestId].events[key] && this.props.user.attending[this.props.guestId].events[key].courses) || (this.props.user.notattending[this.props.guestId] && this.props.user.notattending[this.props.guestId].events && this.props.user.notattending[this.props.guestId].events[key] && this.props.user.notattending[this.props.guestId].events[key].courses)) {
        hasSubmittedCourses[key] = true;
      } else {
        hasSubmittedCourses[key] = false;
      }

    }.bind(this))};

    this.setState({
      edit: edit,
      hasCourses: hasCourses,
      hasSubmittedCourses: hasSubmittedCourses
    });

  },
  handleEdit: function(id) {
    var edit = this.state.edit;

    if(edit[id]) {
      delete edit[id];
    } else {
      edit[id] = true;
    }

    this.setState({
      edit: edit
    });

  },
  handleCourseMeal: function(courseName, eventName, guestName , event) {
    var mealName = event.target.value;

    var courses = this.state.courses;

    courses[courseName] = {
      eventName: eventName,
      courseName: courseName,
      guestName: guestName,
      mealName: mealName
    }

    this.setState({
      courses: courses
    });

    console.log(this.state.courses)

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
