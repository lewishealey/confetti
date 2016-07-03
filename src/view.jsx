var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/users/';
var JQuery = require('jquery');

var axios = require('axios');

var ViewUser = require('./view-user');
var ViewGuest = require('./view-guest');

var root = "http://localhost:8888/confettiapp/";

var Alert = require('./alert');

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
      step: 1,
      popup: {
				open: false, text: false, type: false, count: 0
			},
      showFAQ: false
    })
  },
  componentWillMount: function() {

      this.public = new Firebase('https://boiling-fire-2669.firebaseio.com/public/');

      this.bindAsObject(this.public, "public");

      this.public.child(this.props.params.userId).on("value", function(snapshot) {

        this.fb = new Firebase('https://boiling-fire-2669.firebaseio.com/users/' + snapshot.val());
        this.bindAsObject(this.fb, "user");


      }.bind(this));

  },
  componentDidUpdate: function() {

  },
  componentWillUpdate: function() {

  },
  componentDidMount: function() {

    this.setState({
      loaded: true
    });

  },
  handlePopup: function(type,text) {

		this.setState({
			popup : {
				type: type,
				text: text
			}
		})

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

    if(window.location.href.indexOf("admin") > -1) {
      var guest_id = this.props.params.guestId;
      localStorage.removeItem("guest_id");
    } else {
      if(localStorage.guest_id) {
          var guest_id = localStorage.guest_id;
      } else {
        var guest_id = this.props.params.guestId;
      }
    }

    // If cutoff has passed
    if(this.state.user) {
      // console.info(this.state.user.settings.cutoff_date);
      // console.info(now);

      if(this.state.user.settings && this.state.user.settings.cutoff_date && this.state.user.settings.cutoff_date < now) {

        var content = "Sorry, the cuttoff date has passed"

      } else {

          // If has data
          if((this.props.params.userId && this.props.params.guestId) || localStorage.guest_id) {
            var content = <ViewGuest user={this.state.user} guest={this.state.guest} guestId={guest_id} onChange={this.handleGuest} onCourseMealChange={this.handleMeal} handleTrack={this.handleTrack} handleClearSearch={this.handleClearSearch} handlePopup={this.handlePopup} />
          } else {
            var content =  <ViewUser user={this.state.user} onChange={this.handleGuest} onCourseMealChange={this.handleMeal} userId={this.props.params.userId} handleEmail={this.handleEmail} step={this.state.step} onStep={this.handleStep} handleTrack={this.handleTrack} handleClearSearch={this.handleClearSearch} handlePopup={this.handlePopup} />
          }

      }

    }



  return <div className="container-fluid view">

      <Alert delay={2000} type={this.state.popup.type} >{this.state.popup.text}</Alert>

      <div className="row flex">

        <div className="col-md-5 view__header no-margin" style={{background : 'url("https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/jeffwed_port.jpg?alt=media&token=695b079e-3936-4c3e-a289-7ef90a8289b7") center center',backgroundSize: "cover"}}>

        </div>

        <div className="col-md-7 no-margin">
          <div className="block">
              <img src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/title.png?alt=media&token=cad8d380-4b02-4629-8618-d8b304f8935e" className="view__title"/>
              <span className="line"></span>
              <div className="row">
                <div className="col-md-6 futura tar">
                  You're invited to<br /> celebrate the wedding of<br />persephone and james
                </div>
                <div className="col-md-6 futura">
                  5.11.2016<br /><br />
                  #Jephwed
                </div>
              </div>
              <span className="line"></span>
              {content}

              <div className="faq">
                <h4 className="faq__title">Have a question?</h4>
                <p><button className="btn btn-primary" onClick={this.showFAQ}>View FAQ</button></p>
              </div>

          </div>
        </div>

      </div>


      <div className={"add " + (this.state.showFAQ ? "active" : "not")}>
  			<div className="add__main">

          <div className="row">

  					<div className="col-md-6">
  						<h2 className="add__title">FAQ</h2>
  					</div>
  						<img className="add__close" src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/close.png?alt=media&token=a2250bd0-d07a-4ffc-b10b-cf9c08566932" onClick={this.showFAQ} />
  				</div>

          <div className="row">

            <div className="col-md-12">

                <h4>Where is this happening?</h4>
                <p>The ceremony is at Islington Town Hall near Angel from 3pm. The reception and evening will be at The Prince Albert, a pub in Camden. </p>

                <hr />

                <h4>When do I need to RSVP by?</h4>
                <p>31st August (please and thank you).</p>

                <hr />

                <h4>Are you changing your name?</h4>
                <p>We are both keeping our names. Can you imagine the paperwork?</p>

                <hr />

                <h4>Should I bring a gift?</h4>
                <p>Anyone who has visited our 'cosy' East London flat can attest to the fact that our space is somewhat limited. We would rather you come and have a few drinks with us in the evening. But if you do feel you would like to get us something, a contribution we can put towards our future would be more helpful than 'stuff'. </p>

                <hr />

                <h4>How do I get to Islington Town Hall?</h4>
                <p>Here's a handy link to help you find a route. Otherwise, the nearest tube stations are Angel (Northern line) and Highbury & Islington (Victoria line, Overground).</p>

                <hr />

                <h4>What time should I arrive?</h4>
                <p>Guests can enter the town hall from 2.45pm. If you're early, there's a pub across the road.</p>
                <p>If you're joining us in the evening, feel free to head to the Prince Albert from 7.45pm.</p>

                <hr />

                <h4>How do I get between the town hall and the pub?</h4>
                <p>No need for an Oyster, there will be a classic Routemaster to transport you to the reception.</p>

                <hr />

                <h4>If I'm coming in the evening how do I get to the pub?</h4>
                <p>For those arriving later, here's another handy routefinder. The nearest tube stations are Camden Town (Northern line) and Camden Road (Overground).</p>

                <hr />

                <h4>Will I need cash?</h4>
                <p>Not to worry, the bar at The Prince Albert takes cards.</p>

                <hr />

                <h4>Is there anywhere nearby I can stay?</h4>
                <p>There are plenty of hotels close by. Try the Premier Inn or the Hilton for starters.</p>

                <hr />

                <h4>I have another question!</h4>
                <p>Email us - questions@jephwed.co.uk </p>

              </div>

            </div>

        </div>
      </div>



    </div>

  },
  showFAQ: function() {
    this.setState({
      showFAQ: !this.state.showFAQ
    })
  },
  handleGuest: function(guest, event, truth) {
    console.log(guest + event + truth);
    var timeInMs = Date.now();

    localStorage.setItem("guest_id", guest);

    // Popup
    this.handlePopup("success","Updated!");

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

      this.fb.child("events/" + event + "/notattending/" + guest).remove();
      this.fb.child("notattending/" + guest + "/events/" + event).remove();
      this.fb.child("events/" + event + "/notattending/" + guest).remove();

      // Set state for new view
      this.setState({ responded: "attending" });

    } else {
      this.fb.child("events/" + event + "/attending/" + guest).remove();
      this.fb.child("attending/" + guest + "/events/" + event).remove();
      this.fb.child("events/" + event + "/attending/" + guest).remove();

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

    this.handlePopup("success","Updated!");

  },
  handleEmail: function(value,guest) {

    if(isEmail(value)) {

      this.fb.child("guests/" + guest).update({
          "email": value
          }, function(error) { if (error) { console.log("Nope to update event" + error); } else {
            console.log("updated" + guest + "email with " + value);
          }

      }.bind(this));

        this.setState({ step: 3 });

    } else {
      // Error
    }

    this.handlePopup("success","Updated!");


  },
  handleStep: function(step) {

    this.setState({ step: step });
  }

});


function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
