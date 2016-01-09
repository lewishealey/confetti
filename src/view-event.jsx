var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');


module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return {  
      event: false,
      userId: this.props.userId,
      guestId: this.props.guestId,
      attending: false,
      meals: false
    }
  },
  componentWillMount: function() {
      var mealRef = new Firebase(rootUrl + 'users/' + this.state.userId + "/meals/");
      var eventRef = new Firebase(rootUrl + 'users/' + this.state.userId + "/events/" + this.props.id);
      this.bindAsObject(mealRef, 'meals');
      this.bindAsObject(eventRef, 'event');
  },
  render: function() {
    console.log(this.state.event);
  return <div className="view__event">

    {this.state.event && 

      <div>

        <div className="column__double"> 
          <div className="column--nest"> 

            <h4>{this.state.event.name}</h4>

              {this.state.event.meals &&
                <h6>Has meals</h6>
              }

              <a className="btn btn-success" onClick={this.handleAttending.bind(this,true)}>Attending</a> 
              <a className="btn btn-danger" onClick={this.handleAttending.bind(this,false)}>Cannot Attend</a>

              {(this.state.attending || this.state.event.guests[this.props.guestId].attending == true)&& 

                <div>
                  <h4>Attending</h4>

                  {this.state.event.meals &&

                    <div>

                      <select className="form-control" ref="mealChoice">
                        <option>Select a meal</option>
                    
                          {Object.keys(this.state.event.meals).map(function (key, i) {
                            return <option key={i} value={key}>{this.state.meals[key] ? this.state.meals[key].name : null}</option>
                          }.bind(this))}

                      </select>

                      <a onClick={this.handleMeals}>Save</a>

                    </div>

                  }


                </div>

              }


          </div>
        </div>

      <div className="column__half column--img"> 
        <img src={"http://maps.googleapis.com/maps/api/staticmap?center=" + this.state.event.postcode + "&zoom=16&size=500x500&markers=" + this.state.event.postcode + "&sensor=false"} />
      </div>

    </div>

    }

  </div>
   
  },
  removeMeal: function(mealId) {
    var guestRef = new Firebase(rootUrl + 'users/' + this.state.userId + '/guests/' + this.state.guestId + "/meals");
    var mealRef = new Firebase(rootUrl + 'users/' + this.state.userId + '/meals/' + mealId + "/guests/" + this.state.guestId);
    guestRef.remove();
    mealRef.remove();
  },
  handleMeals: function() {
    var timeInMs = Date.now();
    var mealId = this.refs.mealChoice.getDOMNode().value ;
    var guestRef = new Firebase(rootUrl + 'users/' + this.state.userId + '/guests/' + this.state.guestId);
    var mealRef = new Firebase(rootUrl + 'users/' + this.state.userId + '/meals/' + mealId);
    console.log(event.target.value);

    guestRef.child("meals").update({
      [this.props.id]: mealId
      }, function(error) {
        // Error report event
        if (error) {
        console.log("Event could not be saved" + error);
      } else {
        console.log("Meal added to guest");
      }

    });

    mealRef.child("guests").update({
      [this.state.guestId]: true
      }, function(error) {
        // Error report event
        if (error) {
        console.log("Event could not be saved" + error);
      } else {
        console.log("Meal added to meals");
      }

    });

  },
  handleAttending: function(truth) {
    var guestRef = new Firebase(rootUrl + 'users/' + this.state.userId + '/guests/' + this.state.guestId);
    var eventRef = new Firebase(rootUrl + 'users/' + this.state.userId + '/events/' + this.props.id + '/guests/' + this.state.guestId);

    // console.log(this.state.userId);
    // console.log(this.state.guestId);
    // console.log(this.props.id);

    var timeInMs = Date.now();

    // If true then flip state
    if(truth == true) {

      this.setState({
        attending: true
      });

    } else {

      this.setState({
        attending: false
      });

    }

    // Set attending event key to the guest
      guestRef.child("attending").update({
          [this.props.id]: truth
        }, function(error) { if (error) { 
          console.log("Could not set attending to guest " + error);
        } else {
          console.log("Set " + truth + " attending to guest");
        }

    // Update the event to save guest as attending
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

    });


  }

});
