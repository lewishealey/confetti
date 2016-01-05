var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');
var Choice = require('./choice'); 

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
  return {  
      event: this.props.event,
      edit: false,
      meals: false
    }
  },
  componentWillMount: function() {
    this.fb = new Firebase(rootUrl + 'users/' + this.props.userId + "/events/" + this.props.id);
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/meals/");
    this.bindAsObject(mealRef, 'meals'); 

  },
  render: function() {
  return <div className="column column--border">
    {this.renderList()}
  </div>
            
  },
  renderList: function() {
    var guests = this.state.event.guests;

    // Count the guests
    if(this.state.event.guests) {
      var countGuests = 0;
      for ( guest in guests )   {
         if(guests.hasOwnProperty(guest)) {
            countGuests++;
         }
      }

    }

    if(this.state.edit) {
      return <div className="cont__flex-column">

        <div className="column__half">
          <input type="text" className="form-control" defaultValue={this.props.event.name} onChange={this.handleInputChange.bind(this,"name")} />
        </div>

        <div className="column">
          <input type="text" className="form-control" defaultValue={this.props.event.address} onChange={this.handleInputChange.bind(this,"address")} />
          <input type="text" className="form-control" defaultValue={this.props.event.postcode} onChange={this.handleInputChange.bind(this,"postcode")} />
        </div>

        <div className="column">
          <input type="text" className="form-control" defaultValue={this.props.event.from} onChange={this.handleInputChange.bind(this,"from")} />
          <input type="text" className="form-control" defaultValue={this.props.event.to} onChange={this.handleInputChange.bind(this,"to")} />
        </div>

        <div className="column">

        {this.state.event.meals &&

          Object.keys(this.state.event.meals).map(function (event, i) {
                return <span key={i}> {this.state.meals[event].name} 
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
           <h4>{this.props.event.name}</h4>
           <p>{this.props.event.address ? this.props.event.address : null}</p>
           <p>{this.props.event.postcode ? this.props.event.postcode : null}</p>
           <p>{(this.props.event.from ? this.props.event.from : null) + " - " + (this.props.event.to ? this.props.event.to : null)}</p>
           
            {this.state.event.meals &&
              <p>Meals: 
              {Object.keys(this.state.event.meals).map(function (event, i) {
                return <span key={i}> {this.state.meals[event].name}</span>
              }.bind(this))}
              </p>
            }

            <p>{countGuests ? countGuests + " guests" : "No guests" }</p>

            <a className="btn btn--blue" onClick={this.handleEditClick}>Edit</a>

          </div>
      
    }


  },
  handleEditClick: function() {
    this.setState({ edit: ! this.state.edit })
  },
  handleDeleteClick: function(e) {
    e.preventDefault();
    this.fb.remove();
  },
  handleDeleteMeal: function(event) {
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/meals/" + event);
    var eventRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/events/" + this.props.id + "/meals/" + event);
    eventRef.remove();
    mealRef.remove();


  },
  handleMeal: function() {
    var value = this.refs.mealName.getDOMNode().value;
    this.props.handleMeal(value,this.props.id);

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
