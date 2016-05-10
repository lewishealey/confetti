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
      user: false,
      editCourse: false
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
    // console.log(this.props.id);

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

          {(this.state.user.courses && this.state.user.courses[this.props.id]) &&

            Object.keys(this.state.user.courses[this.props.id]).map(function (course, i) {

              return <div>

                {this.state.editField == course &&
                  <div>
                    <input type="text" className="form-control" defaultValue={this.state.user.courses[this.props.id][course].name} onChange={this.handleEditCourse.bind(this, course)} />
                    <button onClick={this.handleFinishEdit}>Finish editing</button>
                  </div>
                }


                <h4 key={i}>{this.state.user.courses[this.props.id][course].name} <span onClick={this.onEditField.bind(this,course,"course")}>Edit</span> <span onClick={this.handleDeleteCourse.bind(this,course)}>x</span></h4>


              {(this.state.user.courses[this.props.id][course] && this.state.user.courses[this.props.id][course].meals) &&

                Object.keys(this.state.user.courses[this.props.id][course].meals).map(function (meal, i) {

                  return <div>

                    {this.state.editField == meal &&
                      <div>
                        <input type="text" className="form-control" defaultValue={this.state.user.courses[this.props.id][course].meals[meal].name} onChange={this.handleEditMeal.bind(this,meal, course)} />
                        <button onClick={this.handleFinishEdit}>Finish editing</button>
                      </div>
                    }

                    <h5>{this.state.user.courses[this.props.id][course].meals[meal].name} <span onClick={this.onEditField.bind(this,meal,"meal")}>Edit</span> <span onClick={this.handleDeleteMeal.bind(this,meal, course)}>x</span></h5>
                  </div>

                }.bind(this))

              }


              </div>


            }.bind(this))

          }

        {(! this.state.editCourse && ! this.state.editField  ) &&

        <div>

          <h5>Add a course</h5>

            <p><input type="text" className="form-control" placeholder="Course name" ref="courseName" /></p>
            <p><small>Eg, Main course, Dessert</small></p>
            <p><a className="btn btn-info" onClick={this.handleCourse}>Add course</a></p>

        </div>

        }

        {this.state.editCourse &&

          <div>

            <h5>Add meals</h5>

              <p><input type="text" className="form-control" placeholder="Enter meal name" ref="mealName" />
              <a className="btn btn-info" onClick={this.handleMeal}>+</a></p>

          </div>

        }

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
  onEditField: function(id,type) {

    if(type == "course") {
      this.setState({
        editField: id,
        editCourse: id
      })
    } else {
      this.setState({ editField: id })
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
  handleFinishEdit: function() {
    this.setState({
      editField: false,
      editCourse: false
    })
  },
  handleEditMeal: function(meal, course, event) {
    var value = event.target.value;
    // console.log(value)

    userRef.child("courses/" + this.props.id + "/" + course + "/meals/" + meal).update({
        name: value
    });

    // alert("Changing " + meal + " from " + course);

  },
  handleDeleteMeal: function(meal, course) {

    userRef.child("courses/" + this.props.id + "/" + course + "/meals/" + meal).set(null);
    alert("Deleting " + meal + " from " + course);

  },
  handleEditCourse: function(course, event) {
    var value = event.target.value;
    // console.log(value)

    userRef.child("courses/" + this.props.id + "/" + course).update({
      name: value
    });
    // alert("Changing " + course);

  },
  handleDeleteCourse: function(course) {

    userRef.child("courses/" + this.props.id + "/" + course).set(null);
    alert("Deleting " + course);

  },
  handleCourse: function() {

    var timeInMs = Date.now();
    var randomNo = Math.floor(Math.random() * 1000) + 1;
    var value = this.refs.courseName.getDOMNode().value;

    // Unique ID
    var string = (value + randomNo).replace(/ /g,'').toLowerCase();

    userRef.child("courses/" + this.props.id + "/" + string).set({
      name: value,
      date_created: timeInMs
    });

    this.setState({
      editCourse: string
    });


  },
  handleMeal: function() {

    var timeInMs = Date.now();
    var randomNo = Math.floor(Math.random() * 1000) + 1;
    var value = this.refs.mealName.getDOMNode().value;

    // Unique ID
    var string = (value + randomNo).replace(/ /g,'').toLowerCase();

      userRef.child("courses/" + this.props.id + "/" + this.state.editCourse + "/meals/" + string).set({
            name: value,
            date_created: timeInMs
      }, function(error) { if (error) {
        alert("error with meal");
      } else {
        alert("added " + value);
        this.refs.mealName.getDOMNode().value = "";
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
