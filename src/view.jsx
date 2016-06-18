var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/users/';
var JQuery = require('jquery');

var axios = require('axios');

var ViewUser = require('./view-user');
var ViewGuest = require('./view-guest');

var root = "http://localhost:8888/confettiapp/";

//https://api.spotify.com/v1/users/1113560298/playlists/7Fyg5tJ0oQdIRxLwOJ2T1g/tracks?uris=spotify%3Atrack%3A396QaHZq5gGIUS2ZicB5t1

var authid;

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return({
      user: false,
      loaded: false,
      spotify: false,
      emailState: false,
      step: 1
    })
  },
  componentWillMount: function() {

      this.fb = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + this.props.params.userId);
      this.bindAsObject(this.fb, "user");

  },
  componentDidUpdate: function() {

  },
  componentDidMount: function() {

    this.setState({
      loaded: true
    });

  },
  handleTrack: function(guestId,artistName,trackName,albumImage,trackHref,trackId,trackUri) {
    var timeInMs = Date.now();


    this.fb.child("playlist/" + guestId).update({
      id: trackId,
      date_created: timeInMs,
      guest_id: guestId,
      track_name: trackName,
      artist_name: artistName,
      album_image: albumImage,
      uri: trackUri

    }, function(error) { if (error) { console.log("Nope to add track" + error);  } else {

        // Success
        console.log("Added track " + trackId + " " + guestId + " " + artistName);

      } //userRef.child("playlist/")

    }.bind(this));

  },
  render: function() {
    // console.log(this.state.user);

    var now = Date.now();

    // If cutoff has passed
    if(this.state.user) {
      console.info(this.state.user.settings.cutoff_date);
      console.info(now);

      if(this.state.user.settings && this.state.user.settings.cutoff_date < now) {

        var content = "Sorry, the cuttoff date has passed"

      } else {

          // If has data
          if(this.props.params.userId && this.props.params.guestId) {

            var content = <ViewGuest user={this.state.user} onCourseMealChange={this.onCourseMealChange} guest={this.state.guest} guestId={this.props.params.guestId} onChange={this.handleGuest} />
          } else {
            var content =  <ViewUser user={this.state.user} onChange={this.handleGuest} onCourseMealChange={this.handleMeal} userId={this.props.params.userId} handleEmail={this.handleEmail}  step={this.state.step} onStep={this.handleStep} handleTrack={this.handleTrack} />
          }

      }

    }



  return <div className="view">

      <div className="column" style={{background : 'url("http://da-photo.co.uk/wp-content/uploads/2015/07/CS_PWS_BLOG_002.jpg")'}}>
        Photo
      </div>

      <div className="column view--white">
        <div className="column--nest">
          <div className="cont cont__flex-row">
            <div className="column"><h4>RSVP {this.state.user.fname ? this.state.user.fname : ''} & {this.state.user.spousefname ? this.state.user.spousefname + "'s" : ''} wedding</h4></div>
            {this.state.user.wedding_date &&
               <div className="column tar"><h4>{this.state.user.wedding_date}</h4></div>
             }
          </div>
          <h1>Welcome! RSVP now</h1>
          <p>Type in your last name to get going</p>

          <div className="cont cont__flex-row">
            {content}
          </div>

        </div>


      </div>

    </div>

  },
  handleGuest: function(guest, event, truth) {
    console.log(guest + event + truth);
    var timeInMs = Date.now();

    if(truth) {

      // Add attending object to event
      this.fb.child("attending/" + guest).update({
        date_created: timeInMs,

        }, function(error) { if (error) { console.log("Nope to update event" + error);  } else {

          // Success
          console.log("Attending " + guest + " " + event + " " + truth);

        } //userRef.child("attending/")

      }.bind(this));

      this.fb.child("attending/" + guest + "/events/").update({
        [event]: true

        }, function(error) { if (error) { console.log("Nope to update event" + error);  } else {

          // Success
          console.log("Attending " + guest + " " + event + " " + truth);

        } //userRef.child("attending/")

      }.bind(this));

      this.fb.child("events/" + event + "/attending/").update({

          [guest]: true

          }, function(error) { if (error) { console.log("Nope to update event" + error); } else {

            // Success
            console.log("Event " + event + " " + guest + " " + truth);

          }

      }.bind(this));

      this.fb.child("events/" + event + "/notattending/").remove();
      this.fb.child("notattending/" + guest + "/events/" + event).remove();

      // Set state for new view
      this.setState({ responded: "attending" });

    } else {
      this.fb.child("events/" + event + "/attending/").remove();
      this.fb.child("attending/" + guest + "/events/" + event).remove();

      // Add attending object to event
      this.fb.child("notattending/" + guest + "/events/").update({
        [event]: true

        }, function(error) { if (error) { console.log("Nope to update event" + error);  } else {

          // Success
          console.log("fafsfsa " + guest + " " + event + " " + truth);

        } //userRef.child("attending/")

      }.bind(this));


      // Add attending object to event
      this.fb.child("notattending/" + guest).update({
        date_created: timeInMs,

        }, function(error) { if (error) { console.log("Nope to update event" + error);  } else {

          // Success
          console.log("Not attending " + guest + " " + event + " " + truth);

        } //userRef.child("attending/")

      }.bind(this));


      this.fb.child("events/" + event + "/notattending/").update({

          [guest]: true

          }, function(error) { if (error) { console.log("Nope to update event" + error); } else {

            // Success
            console.log("N Event " + event + " " + guest + " " + truth);

          }

      }.bind(this));

      // Set state for new view
      this.setState({ responded: "notattending" });

    }
  },
  handleMeal: function(mealName, courseName, eventName, guestName) {
    // console.info(mealName + "/" + courseName + "/" + eventName + "/" + guestName)
    var timeInMs = Date.now();

    this.fb.child("attending/" + guestName + "/events/" + eventName + "/courses/" + courseName).update({
        date_created: timeInMs,
        meal_name: mealName
    });

  },
  handleEmail: function(value,guest) {

    if(isEmail(value)) {

      this.fb.child("guests/" + guest).update({
          "email": value
          }, function(error) { if (error) { console.log("Nope to update event" + error); } else {
            console.log("updated" + guest + "email with " + value);
          }

      }.bind(this));

    } else {
      // Error
    }


  }

});

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
