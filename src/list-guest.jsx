var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');
var Choice = require('./choice');

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
  return {
    guest: false,
    events: false,
    edit: false,
    eventChoices: [],
    user: false
    }
  },
  componentWillMount: function() {
      this.fb = new Firebase(rootUrl + 'users/' + this.props.userId + "/guests/" + this.props.guest.key);
      var eventRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/events/");
      this.bindAsObject(eventRef, 'events');

      userRef = new Firebase(rootUrl + 'users/' + this.props.userId);
      this.bindAsObject(userRef, 'user');

      this.setState({ guest: this.props.guest })
  },
  render: function() {
  return <div>
    {this.renderList()}
  </div>

  },
  renderList: function() {

    if(this.state.events) {
          // Loop through event choices object for simple toggle
          var eventOptions = Object.keys(this.state.events).map(function (key, i) {
            return <div><Choice key={key} id={key} value={i} name={this.state.events[key].name} handleChoice={this.handleChoice} active={this.state.guest.events ? (this.state.guest.events[key] ? true : false) : ''}/></div>
          }.bind(this));
        } else {
          var eventOptions = "Not set";
    }

    if(this.state.edit) {
      return <div className="cont">

        <div className="guest__column-half">
          <input type="text" className="form-control" defaultValue={this.state.guest.fname} onChange={this.handleInputChange.bind(this,"fname")} />
        </div>

        <div className="guest__column-half">
          <input type="text" className="form-control" defaultValue={this.state.guest.lname} onChange={this.handleInputChange.bind(this,"lname")} />
        </div>

        <div className="guest__column">
          <input type="text" className="form-control" defaultValue={this.state.guest.email} onChange={this.handleInputChange.bind(this,"email")} />
        </div>

        <div className="guest__column">

          <input type="text" className="form-control" defaultValue={this.state.guest.address} onChange={this.handleInputChange.bind(this,"address")} />
          <input type="text" className="form-control" defaultValue={this.state.guest.postcode} onChange={this.handleInputChange.bind(this,"postcode")} />
        </div>

        <div className="guest__column">
          {eventOptions}
        </div>


        <div className="guest__column">
          <a onClick={this.handleEditClick}>Save</a>
        </div>

      </div>

    } else {

      return <div className="cont row">

        <div className="column">
          {this.props.guest.fname + " " + this.props.guest.lname} <span className="column--rev-hover">{this.props.guest.email}</span>
        </div>

        <div className={this.props.attending ? "column column__double" : "column"} >
          {this.props.guest.events &&
            Object.keys(this.props.guest.events).map(function (event) {
              return <span>{this.state.events[event] ? this.state.events[event].name : null} </span>
            }.bind(this))
          }
        </div>

        {this.props.attending == false &&
          <div className="column guest__edit">
            <a href={"/confetti_app/#/page/" + this.props.userId + "/guest/" + this.props.guest.key} target="blank">View as guest</a>
            <a onClick={this.handleEditClick}> Edit </a>
            <a onClick={this.handleDeleteClick}>Delete</a>
          </div>
        }

      </div>
    }


  },
  handleEditClick: function() {
    this.setState({ edit: ! this.state.edit }) 
  },
  handleDeleteClick: function(e) {
    e.preventDefault();

    // Remove guest
    this.fb.remove();

    userRef.child("attending/" + this.state.guest.key).remove();
    userRef.child("notattending/" + this.state.guest.key).remove();
    userRef.child("invited/" + this.state.guest.key).remove();

    Object.keys(this.props.guest.events).map(function (event) {

      // Remove guest from event
      userRef.child("events/" + event + "/guests/" + this.state.guest.key).remove();
      userRef.child("events/" + event + "/attending/" + this.state.guest.key).remove();
      userRef.child("events/" + event + "/notattending/" + this.state.guest.key).remove();

    }.bind(this))

  },
  handleInputChange: function(string, event) {
    var value = event.target.value;

    this.fb.update({
          [string]: value
        }, function(error) { if (error) {
          console.log("Could not " + value + error);
        } else {
          console.log("Set " + value + " to " + string);
        }
    });

  },
  handleChoice: function(choice,id,truth) {
    console.log(choice + id + truth);
    var eventRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/events/" + id + "/guests/" + this.state.guest.key);
    var attendingRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/invited/");

    if(truth == true) {

    // Add referent to guest
    eventRef.update({
          attending: truth
        }, function(error) { if (error) {
          console.log("Could not " + id + error);
        } else {
          console.log("Set " + id + " to " + truth);
        }
    });

    // Add reference to event
    this.fb.child("events").update({
          [id]: truth
        }, function(error) { if (error) {
          console.log("Could not " + id + error);
        } else {
          console.log("Set " + id + " to " + truth);
        }
    });


    // Add reference to attending
    attendingRef.child(this.state.guest.key).update({
          [id]: truth
        }, function(error) { if (error) {
          console.log("Could not " + id + error);
        } else {
          console.log("Set attending" + id + " to " + truth);
        }
    });


    } else {
      var guestRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/guests/" + this.state.guest.key);

      // Remove Event from guest
      this.fb.child("/events/" + id).remove();

      attendingRef.child(this.state.guest.key + "/" + id).remove();

      // Remove guest from event
      eventRef.remove();


    }

  }
});
