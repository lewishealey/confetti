var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');


module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return {  
      event: false,
      userId: false,
      guestId: this.props.guestId,
      attending: false,
      meals: false,
      guest: false,
      user: false,
      responded: false
    }
  },
  componentWillMount: function() {
      userRef = new Firebase(rootUrl + 'users/' + this.props.userId);
      this.bindAsObject(userRef, 'user');
  },
  componentDidMount: function() {

    if(this.state.user.attending && this.state.user.attending[this.props.guestId] && this.state.user.attending[this.props.guestId][this.props.id]) {
      this.setState({ responded: "attending" });
    }

    if(this.state.user.notattending && this.state.user.notattending[this.props.guestId] && this.state.user.notattending[this.props.guestId][this.props.id]) {
      this.setState({ responded: "notattending" });
    }

  },
  renderList: function() {

      if(this.state.responded == "attending") {
        
        if(this.state.user.events[this.props.id].from && this.state.user.events[this.props.id].to) {
          var event_time = this.state.user.events[this.props.id].from + " - " + this.state.user.events[this.props.id].to;
        } else {
          var event_time = '';
        }

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
            <h4 className="event__title">{this.state.user.events ? this.state.user.events[this.props.id].name : ''}</h4>
            <h6>{event_time}</h6>
            <p className="sub">Thanks for attending! A notification has been sent to Lewis & Lucy to let them know you will be at the big day.</p>
          </div>

          <div className="column">

            {(this.state.user.events[this.props.id].meals && this.state.user.guests[this.props.guestId].meals == false) &&
              <div>

                <label>Select a meal option</label>

                  <select className="form-control" ref="mealChoice">
                    <option>Select a meal</option>
                
                      {Object.keys(this.state.user.events[this.props.id].meals).map(function (key, i) {
                        return <option key={i} value={key}>{this.state.user.meals[key] ? this.state.user.meals[key].name : null}</option>
                      }.bind(this))}

                  </select>

                <a onClick={this.handleMeals}>Save</a>

              </div>
            }

            {(this.state.user.events[this.props.id].meals && this.state.user.guests[this.props.guestId].meals) &&

              Object.keys(this.state.user.guests[this.props.guestId].meals).map(function (key, i) {
                      return <p>{this.state.user.meals[key] ? this.state.user.meals[key].name : null}</p>
              }.bind(this))

            }


        </div>

        <div className="column">
          <a onClick={this.handleAttending.bind(this,false)}>I cannot attend</a>
        </div>
      </div>

      }

      if(this.state.responded == "notattending") {
        return <div> 
                  <div className="column cont">
                    <div className="column__half-width">
                      <h4 className={"event__title " + (this.state.responded == "notattending" ? "event--nattending" : null)}>Not attending</h4>
                    </div>

                    <div className="column__half-width event__nattending-icon">
                      <i className="material-icons">clear</i>
                    </div>

                  </div>

                  <div className="column">
                      <h4>{this.state.user.events[this.props.id].name ? this.state.user.events[this.props.id].name : null}</h4>
                    </div>

                  <div className="column">
                    {"Oh no! you can't attending :( Fancy letting Lewis & Lucy as to why?"}
                  </div>

                  <div className="column">
                    <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b" onClick={this.handleAttending.bind(this,true)}>Attending</a> 
                    <a className="btn btn--outline btn--rose-o btn--icon btn--icon-cross btn--m-b" onClick={this.handleAttending.bind(this,false)}>Not Attending</a> 
                </div>

              </div>

      }

      if(this.state.responded == false) {
        return <div> 
                  <div className="column cont">
                    <div className="column__half-width">
                      <h4 className="event__title">{this.state.user.events ? this.state.user.events[this.props.id].name : ''}</h4>
                    </div>

                    <div className="column__half-width">
                      <h4>{event_time}</h4>
                    </div>
                  </div>

                  {this.state.user.events[this.props.id].address &&
                    <div className="column">
                      <p className="sub">
                        {this.state.user.events[this.props.id].address + ", " + this.state.user.events[this.props.id].postcode}<br />
                        <a href="#">View on map</a>
                      </p>
                    </div>
                  }

                  <div className="column">
                    <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b" onClick={this.handleAttending.bind(this,true)}>Attending</a> 
                    <a className="btn btn--outline btn--rose-o btn--icon btn--icon-cross btn--m-b" onClick={this.handleAttending.bind(this,false)}>Not Attending</a> 
                </div>

              </div>

      }


  },
  render: function() {

    console.log(this.state.responded);

  return <div className={"column__half-width event__single " + (this.state.responded == "notattending" ? "not" : null)}> 


      <div className="column--nest">
      {this.state.user &&
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

    userRef.child("guests/" + this.props.guestId + "/meals/").update({
      [mealId]: true
      }, function(error) {
        // Error report event
        if (error) {
        console.log("Event could not be saved" + error);
      } else {
        console.log("Meal added to guest");

      }

    });

    userRef.child("/meals/" + mealId + "/guests/").update({
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
    eventid = this.props.id;

    if(truth) {

      // Add attending object to event
      userRef.child("attending/" + this.props.guestId).update({ 

        [this.props.id]: true

        }, function(error) { if (error) { console.log("Nope to update event" + error);  } else {
          
          // Success
          console.log("Attending " + this.props.guestId + " " + this.props.id + " " + truth);

        } //userRef.child("attending/")

      }.bind(this));

      userRef.child("events/" + this.props.id + "/attending/").update({ 

          [this.props.guestId]: true

          }, function(error) { if (error) { console.log("Nope to update event" + error); } else {
              
            // Success
            console.log("Event " + this.props.id + " " + this.props.guestId + " " + truth);

          }

      }.bind(this));

      userRef.child("events/" + this.props.id + "/notattending/").remove();
      userRef.child("notattending/" + this.props.guestId + "/" + this.props.id).remove();

      // Set state for new view
      this.setState({ responded: "attending" });


    } else {
      userRef.child("events/" + this.props.id + "/attending/").remove();
      userRef.child("attending/" + this.props.guestId + "/" + this.props.id).remove();

      // Add attending object to event
      userRef.child("notattending/" + this.props.guestId).update({ 

        [this.props.id]: true

        }, function(error) { if (error) { console.log("Nope to update event" + error);  } else {
          
          // Success
          console.log("Not attending " + this.props.guestId + " " + this.props.id + " " + truth);

        } //userRef.child("attending/")

      }.bind(this));

      userRef.child("events/" + this.props.id + "/notattending/").update({ 

          [this.props.guestId]: true

          }, function(error) { if (error) { console.log("Nope to update event" + error); } else {
              
            // Success
            console.log("N Event " + this.props.id + " " + this.props.guestId + " " + truth);

          }

      }.bind(this));

      // Set state for new view
      this.setState({ responded: "notattending" });


    }


  }


});
