var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';


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
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + "/meals/");

    // Bind Events, Meals & Guests to states
    this.bindAsObject(eventRef, 'events'); 
    this.bindAsObject(firebaseRef, 'guest');
    this.bindAsObject(mealRef, 'meals');

  },
  componentDidMount: function() {
    this.setState({
      loaded: true,
      userId: this.props.params.userId 
    });

  },
  render: function() {

    // If component is loaded
    if(this.state.loaded && this.state.guest.events) {

    var content = Object.keys(this.state.guest.events).map(function (key, i) {

              return <div key={i} className="view__event"> 
                
                <div className="column__double"> 
                  <div className="column--nest"> 

                    <h4>{this.state.events[key].name}</h4>
                    <p>{this.state.events[key].address} {this.state.events[key].postcode}</p>

                    {( ! this.state.guest.meals && this.state.events[key].guests[this.props.params.guestId].attending == true) && 
                      <div>

                        <div>

                        <select className="form-control" ref="mealChoice">
                          <option>Select a meal</option>
                        
                          {Object.keys(this.state.events[key].meals).map(function (mKey, i) {
                            return <option key={i} value={mKey}>{this.state.meals[mKey].name}</option>
                          }.bind(this))}

                        </select>

                        <a onClick={this.handleMeals}>Save</a>

                        </div>




                      </div>

                    }

                    {(this.state.events[key].guests[this.props.params.guestId].attending == true) &&
                      <div>
                      <h4>Attending</h4>

                      {Object.keys(this.state.guest.events)[i] &&

                      <div>
                        <h4>{this.state.meals[Object.keys(this.state.guest.meals)[0]].name}</h4>
                        <a className={this.removeMeal.bind(this,Object.keys(this.state.guest.meals)[0])}>Remove</a>
                      </div>

                      } 

                      </div>

                    }

                    <a className="btn btn-success" onClick={this.handleAttending.bind(this,key,this.props.params.guestId,this.state.userId,true)}>Attending</a> 
                    <a className="btn btn-danger" onClick={this.handleAttending.bind(this,key,this.props.params.guestId,this.state.userId,false)}>Cannot Attend</a>

                </div>

              </div>

              <div className="column__half column--img"> 
                <img src={"http://maps.googleapis.com/maps/api/staticmap?center=" + this.state.events[key].postcode + "&zoom=16&size=500x500&markers=" + this.state.events[key].postcode + "&sensor=false"} />
              </div>

              </div>

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

          {content}

        </div>


      </div>

    </div>

  },
  removeMeal: function(mealId) {
    var guestRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + '/guests/' + this.props.params.guestId + "/meals");
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + '/meals/' + mealId + "/guests/" + this.props.params.guestId);
    guestRef.remove();
    mealRef.remove();
  },
  handleMeals: function() {
    var timeInMs = Date.now();
    var mealId = this.refs.mealChoice.getDOMNode().value ;
    var guestRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + '/guests/' + this.props.params.guestId);
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.params.userId + '/meals/' + mealId);
    console.log(event.target.value);

    guestRef.child("meals").set({
      [mealId]: true
      }, function(error) {
        // Error report event
        if (error) {
        console.log("Event could not be saved" + error);
      } else {
        console.log("Meal added to guest");
      }

    });

    mealRef.child("guests").set({
      [this.props.params.guestId]: true
      }, function(error) {
        // Error report event
        if (error) {
        console.log("Event could not be saved" + error);
      } else {
        console.log("Meal added to meals");
      }

    });

  },
  handleAttending: function(eventId, guestId, userId, truth) {
    console.log(eventId);
    console.log(userId);
    console.log(guestId);

    var timeInMs = Date.now();
    var guestRef = new Firebase(rootUrl + 'users/' + userId + '/guests/' + guestId);
    var eventRef = new Firebase(rootUrl + 'users/' + userId + '/events/' + eventId + '/guests/' + guestId);

    eventRef.update({ 
      attending: truth
    }, function(error) {
      // Error report event
      if (error) {
      console.log("Nope to update event" + error);
    } else {
      console.log("Updated event" + truth);
    }

    });

    guestRef.child("attending").set({
      [eventId]: truth
      }, function(error) {
        // Error report event
        if (error) {
        console.log("Attending update error " + error);
      } else {
        console.log("Guest has been updated with " + truth);
      }

    });

  },
  handleNotAttending: function() {

  }

});
