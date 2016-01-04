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
      meals: false
    }
  },
  componentWillMount: function() {
    var eventRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/meals/");
    this.bindAsObject(eventRef, 'meals'); 

    this.setState({event: this.props.event});
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
          <input type="text" className="form-control" defaultValue={this.state.event.name} onChange={this.handleInputChange.bind(this,"name")} />
        </div>

        <div className="column">

          <input type="text" className="form-control" defaultValue={this.props.event.address} onChange={this.handleInputChange.bind(this,"address")} />
          <input type="text" className="form-control" defaultValue={this.props.event.postcode} onChange={this.handleInputChange.bind(this,"postcode")} />
        </div>


        <div className="column">
          <a onClick={this.handleEditClick}>Save</a> 
        </div>

      </div>

    } else {
 
      return <div className="column--nest">
           <h4>{this.state.event.name}</h4>
           <p>{this.state.event.address ? this.state.event.address : null}</p>
           <p>{this.state.event.postcode ? this.state.event.postcode : null}</p>
           <p>{(this.state.event.from ? this.state.event.from : null) + " - " + (this.state.event.to ? this.state.event.to : null)}</p>
           
            {this.state.event.meals &&
              <p>Meals: 
              {Object.keys(this.state.event.meals).map(function (event, i) {
                return <span key={i}> {this.state.meals[event].name} </span>
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
