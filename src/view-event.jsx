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
  renderList: function() {
    if(this.state.attending || this.state.event.guests[this.props.guestId].attending == true) {
      return <div>     
        <div className="column cont">
          <div className="column__half-width">
            <h4 className="event__title event--attending">Attending</h4>
          </div>
          <div className="column__half-width event__attending-icon">
            <i className="material-icons">done</i>
          </div>
        </div>

        <div className="column">
          <h4 className="event__title">{this.state.event.name}</h4>
          <h6>{this.state.event.from + " - " + this.state.event.to}</h6>
          <p className="sub">Thanks for attending! A notification has been sent to Lewis & Lucy to let them know you will be at the big day.</p>
        </div>

        <div className="column">
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

        <div className="column">
          <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b" onClick={this.handleAttending.bind(this,true)}>Attending</a> 
          <a className="btn btn--outline btn--ghost-o btn--icon btn--icon-cross" onClick={this.handleAttending.bind(this,false)}>Cannot Attend</a>
        </div>
      </div>

    } else {

      return <div> 
                <div className="column cont">
                  <div className="column__half-width">
                    <h4 className="event__title">{this.state.event.name}</h4>
                  </div>

                  <div className="column__half-width">
                    <h4>{this.state.event.from + " - " + this.state.event.to}</h4>
                  </div>
                </div>

                <div className="column">
                  <p className="sub">
                    {this.state.event.address + ", " + this.state.event.postcode}<br />
                    <a href="#">View on map</a>
                  </p>
                </div>

                <div className="column">
                  <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b" onClick={this.handleAttending.bind(this,true)}>Attending</a> 
                  <a className="btn btn--outline btn--ghost-o btn--icon btn--icon-cross" onClick={this.handleAttending.bind(this,false)}>Cannot Attend</a>
              </div>

            </div>


    }
  },
  render: function() {

  return <div className={((this.state.attending || this.state.event.guests[this.props.guestId].attending == true) ? "active " : "" ) + "column__half-width event__single"}> 


      <div className="column--nest">
        {this.state.event && 
          this.renderList()
        }
      </div>
            

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
