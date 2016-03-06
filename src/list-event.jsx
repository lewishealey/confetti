var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');
var Choice = require('./choice'); 

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
  return {  
      event: false,
      edit: false,
      meals: false,
      user: false
    }
  },
  componentWillMount: function() {
    userRef = new Firebase(rootUrl + 'users/' + this.props.userId);

    this.fb = new Firebase(rootUrl + 'users/' + this.props.userId + "/events/" + this.props.id);
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/meals/");
    this.bindAsObject(mealRef, 'meals'); 
    this.bindAsObject(this.fb, 'event'); 

    this.bindAsObject(userRef, 'user'); 

    this.setState({
      edit : this.props.edit
    });

  },
  render: function() {
      return (
        <div className="column column--border">
          {this.renderList()}
        </div>
      )
            
  },
  renderList: function() {
    console.log(this.props.id);

    var countGuests = 0;
    // Count the guests
    // if(this.state.user.event[this.props.id] && this.state.user.event[this.props.id].guests) {
    //   var guests = this.state.user.events[this.props.id].guests;
    //   var countGuests = 0;
    //   for ( guest in guests )   {
    //      if(guests.hasOwnProperty(guest)) {
    //         countGuests++;
    //      }
    //   }

    // }.bind(this)

    if(this.state.edit) {
      return <div className="cont__flex-column">

        <div className="column__half">
          <input type="text" className="form-control" defaultValue={this.state.user.events[this.props.id].name} onChange={this.handleInputChange.bind(this,"name")} />
        </div>

        <div className="column">
          <input type="text" className="form-control" defaultValue={this.state.user.events[this.props.id].address} onChange={this.handleInputChange.bind(this,"address")} />
          <input type="text" className="form-control" defaultValue={this.state.user.events[this.props.id].postcode} onChange={this.handleInputChange.bind(this,"postcode")} />
        </div>

        <div className="column">
          <input type="text" className="form-control" defaultValue={this.state.user.events[this.props.id].from ? this.state.user.events[this.props.id].from : ''} onChange={this.handleInputChange.bind(this,"from")} />
          <input type="text" className="form-control" defaultValue={this.state.user.events[this.props.id].to ? this.state.user.events[this.props.id].to : ''} onChange={this.handleInputChange.bind(this,"to")} />
        </div>

        <div className="column">

        {this.state.user.events[this.props.id].meals &&

          Object.keys(this.state.user.events[this.props.id].meals).map(function (event, i) {
                return <span key={i}> {this.state.user.meals[event] ? this.state.user.meals[event].name : null} 
                <span onClick={this.handleDeleteMeal.bind(this,event)}>Delete</span></span>
            }.bind(this))

        }

        </div>


        <div className="column">

        <h5>Add meals</h5>

          <p><input type="text" className="form-control" placeholder="Enter meal name" ref="mealName" />
          <a className="btn btn-info" onClick={this.handleMeal}>+</a></p>

        </div>


        <div className="column">
            <a onClick={this.handleEditClick}>Save</a> 
        </div>

      </div>

    } else {
 
      return <div className="column--nest">
           <h4>{this.state.user.events[this.props.id].name}</h4>
           <p>{this.state.user.events[this.props.id].address ? this.state.user.events[this.props.id].address : ''}</p>
           <p>{this.state.user.events[this.props.id].postcode ? this.state.user.events[this.props.id].postcode : ''}</p>
           <p>{this.state.user.events[this.props.id].from || this.state.user.events[this.props.id].to ? (this.state.user.events[this.props.id].from ? this.state.user.events[this.props.id].from : '') + " - " + (this.state.user.events[this.props.id].to ? this.state.user.events[this.props.id].to : '') : ''}</p>

           {this.state.user.events[this.props.id].meals &&
              <p>Meals: 
              {Object.keys(this.state.user.events[this.props.id].meals).map(function (event, i) {
                return <span key={i}> {this.state.user.meals[event] ? this.state.user.meals[event].name : ''}</span>
              }.bind(this))}
              </p>
            }
          

            <p>{countGuests ? countGuests + " guests" : "No guests" }</p>

            <a className="btn btn--blue" onClick={this.handleEditClick}>Edit</a> <a onClick={this.handleDeleteClick}>Delete</a>

          </div>
      
    }


  },
  handleEditClick: function() {
    this.setState({ edit: ! this.state.edit })
  },
  handleDeleteClick: function(e) {
    // e.preventDefault();

    // Remove event
    userRef.child("events/" + this.props.id).remove();

    // Remove from all guest record
    {Object.keys(this.state.user.guests).map(function (guest, i) {
      userRef.child("guests/" + guest + "/events/" + this.props.id).remove();
      userRef.child("attending/" + guest + "/" + this.props.id).remove();
      userRef.child("notattending/" + guest + "/" + this.props.id).remove();
      userRef.child("invited/" + guest + "/" + this.props.id).remove();
    }.bind(this))}

  },
  handleDeleteMeal: function(event) {
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/meals/" + event);
    var eventRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/events/" + this.props.id + "/meals/" + event);
    eventRef.remove();
    mealRef.remove();

  },
  handleMeal: function() {

    var timeInMs = Date.now();
    var randomNo = Math.floor(Math.random() * 1000) + 1;
    var value = this.refs.mealName.getDOMNode().value;

    // Unique ID
    var string = (value + randomNo).replace(/ /g,'').toLowerCase();

    // // Firebase Obj
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/meals/");
    var eventRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/events/" + this.props.id + "/meals/");

      mealRef.child(string).set({
            name: value,
            date_created: timeInMs,
            event: this.props.id
          }, function(error) { if (error) { 

            console.log("Could not " + value + error);
          } else {
            console.log("Set " + value + " to " + string);

            // If can create meal then add to event
            eventRef.update({
                [string]: true,
              }, function(error) { if (error) { console.log("Could not " + value + error); } else { console.log("Set " + value + " to " + string); }
            });

          }
      });



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


  }
});
