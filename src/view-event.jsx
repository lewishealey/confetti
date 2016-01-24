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
      meals: false,
      updated: false,
      guest: false
    }
  },
  componentWillMount: function() {
      var mealRef = new Firebase(rootUrl + 'users/' + this.state.userId + "/meals/");
      var eventRef = new Firebase(rootUrl + 'users/' + this.state.userId + "/events/" + this.props.id);
      var guestRef = new Firebase(rootUrl + 'users/' + this.state.userId + "/guests/" + this.props.guestId);

      this.bindAsObject(mealRef, 'meals');
      this.bindAsObject(eventRef, 'event');
      this.bindAsObject(guestRef, 'guest');
  },
  componentDidMount: function() {

    // If true then flip state
    if(this.state.event.guests[this.props.guestId].attending == "yes") {

      this.setState({
        attending: "yes"
      });

    }

    if(this.state.event.guests[this.props.guestId].attending == "no") {

      this.setState({
        attending: "no"
      });

    }

  },
  renderList: function() {
    if(this.state.event.guests[this.props.guestId].attending == "yes") {
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


          {(this.state.event.meals && this.state.guest.meals == false) &&
            <div>
              <label>Select a meal option</label>
              <select className="form-control" ref="mealChoice">
                <option>Select a meal</option>
            
                  {Object.keys(this.state.event.meals).map(function (key, i) {
                    return <option key={i} value={key}>{this.state.meals[key] ? this.state.meals[key].name : null}</option>
                  }.bind(this))}

              </select>
              <a onClick={this.handleMeals}>Save</a>
            </div>
          }

          {(this.state.event.meals && this.state.guest.meals) &&

            Object.keys(this.state.guest.meals).map(function (key, i) {
                    return <p>{this.state.meals[key] ? this.state.meals[key].name : null}</p>
            }.bind(this))

          }


        </div>

        <div className="column">
          <a onClick={this.handleAttending.bind(this,"no")}>I cannot attend</a>
        </div>
      </div>

    }

    if (this.state.event.guests[this.props.guestId].attending == "no"){

      return <div> 
                <div className="column cont">
                  <div className="column__half-width">
                    <h4 className="event__title event--nattending">Not Attending</h4>
                  </div>
                  <div className="column__half-width event__nattending-icon">
                    <i className="material-icons">clear</i>
                  </div>
                </div>

                <div className="column">
                  <h4 className="event__title">{this.state.event.name}</h4>
                </div>

                <div className="column">
                  <p className="sub">{"Oh no! you can't attending :( Fancy letting Lewis & Lucy as to why?"}</p>
                </div>

                <div className="column">
                  <a onClick={this.handleAttending.bind(this,"yes")}>I can attend now</a> 
              </div>

            </div>


    }

    if (this.state.attending == false){

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
                  <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b" onClick={this.handleAttending.bind(this,"yes")}>Attending</a> 
                  <a className="btn btn--outline btn--ghost-o btn--icon btn--icon-cross" onClick={this.handleAttending.bind(this,"no")}>Cannot Attend</a>
              </div>

            </div>


    }
  },
  render: function() {

  return <div className={(this.state.attending == "yes" ? "active " : "" ) + (this.state.attending == "no" ? "not " : "" ) + "column__half-width event__single"}> 


      <div className="column--nest">
        {this.state.event && 
          this.renderList()
        }
        {this.state.status ? this.state.status : null}
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

    guestRef.child("meals").update({
      [mealId]: true
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
    if(truth == "yes") {

      this.setState({
        attending: "yes"
      });

    } else {

      this.setState({
        attending: "no"
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
