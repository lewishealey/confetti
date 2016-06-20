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
      editCourse: false,
      course: {}
    }
  },
  componentWillMount: function() {
    userRef = new Firebase(rootUrl + 'users/' + this.props.userId);

    this.fb = new Firebase(rootUrl + 'users/' + this.props.userId + "/events/" + this.props.id);
    var mealRef = new Firebase(rootUrl + 'users/' + this.props.userId + "/meals/");
    this.bindAsObject(mealRef, 'meals');
    this.bindAsObject(this.fb, 'event');

    this.bindAsObject(userRef, 'user');

    if(this.props.user && this.props.user.courses && this.props.user.courses[this.props.id]) {
      this.setState({ course: this.props.user.courses[this.props.id] });
    }

    this.setState({
      edit : this.props.edit
    });

  },
  render: function() {
      return (
        <div className="col-md-4 column--border">
          {this.renderList()}
        </div>
      )
  },
  renderList: function() {

    if(this.state.edit) {
      return <div>

        <div className="row">
          <div className="col-md-12">
            <label>Event name</label>
            <input type="text" className="form-control" ref="eventName" defaultValue={this.state.user.events[this.props.id].name} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label>From</label>
            <input type="text" className="form-control" ref="eventFTime" defaultValue={this.state.user.events[this.props.id].from ? this.state.user.events[this.props.id].from : "From"} />
          </div>

          <div className="col-md-6">
            <label>To</label>
            <input type="text" className="form-control" ref="eventTTime" defaultValue={this.state.user.events[this.props.id].to ? this.state.user.events[this.props.id].to : "To"} />
          </div>
        </div>

          <div className="row">
            <div className="col-md-12">
              <label>Address</label>
              <input type="text" className="form-control" ref="eventAddress" name="address" defaultValue={this.state.user.events[this.props.id].address ? this.state.user.events[this.props.id].address : "Address"} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <label>Postcode</label>
              <input type="text" className="form-control" ref="eventPostcode" name="postcode" defaultValue={this.state.user.events[this.props.id].postcode ? this.state.user.events[this.props.id].postcode : "Postcode"} />
            </div>
          </div>

          {this.state.course &&
            Object.keys(this.state.course).map(function (course, i) {

              return <div>
                <h5>{this.state.course[course].name} <span className="event-list__meal--delete" onClick={this.deleteCourse.bind(this,course)}>Delete</span></h5>
                  {this.state.course[course].meals &&
                  <div>
                    {Object.keys(this.state.course[course].meals).map(function (meal, i) {
                      return <li>{this.state.course[course].meals[meal].name} <span className="event-list__meal--delete" onClick={this.deleteMeal.bind(this,meal,course)}>Delete</span></li>
                    }.bind(this))}
                  </div>
                }
              </div>

            }.bind(this))
          }

          <h5>Add a course</h5>
  				<p><input type="text" className="form-control" placeholder="Enter meal name" ref="courseName" />
  				<a className="btn btn-default" onClick={this.handleCourse}>Add course</a></p>

  				<div>
  					<h5>Add meals to course</h5>
  					<select className="form-control" ref="courseSelect">
  						{Object.keys(this.state.course).map(function (key, i) {
  							return <option key={i} value={key}>{this.state.course[key].name}</option>
  						}.bind(this))}
  					</select>
  					<input type="text" className="form-control" placeholder="Enter meal name" ref="mealName" />
  					<a className="btn btn-default" onClick={this.handleMeal}>Add meal</a>
  				</div>


        <div className="col-md-12">
          <button onClick={this.handleChange} className="btn btn-success">Save</button> <button onClick={this.handleEditClick} className="btn btn--rose-o">Cancel</button>
        </div>

      </div>

    } else {

      return <div className="column--nest">

        {this.props.countAttending}
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

            <a className="btn btn--blue" onClick={this.handleEditClick}>Edit</a> <a onClick={this.handleDeleteClick}>Delete</a>

          </div>

    }


  },
  deleteCourse: function(course) {
    var courseData = this.state.course;
    delete courseData[course];

    this.setState({ course: courseData })

  },
  deleteMeal: function(meal,course) {
    var courseData = this.state.course;
    delete courseData[course].meals[meal];

    this.setState({ course: courseData })

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
  handleChange: function() {
    var eventName = this.refs.eventName.getDOMNode().value;
		var fromTime = this.refs.eventFTime.getDOMNode().value;
		var toTime = this.refs.eventTTime.getDOMNode().value;
		var eventAddress = this.refs.eventAddress.getDOMNode().value;
		var eventPostcode = this.refs.eventPostcode.getDOMNode().value;

    // console.log(eventName);
    // console.log(fromTime);
    // console.log(toTime);
    // console.log(eventAddress );
    // console.log(eventPostcode);
    // console.log(this.state.course);

    this.props.handleEvent(eventName,eventAddress,eventPostcode,fromTime,toTime,this.state.course,"edit",this.props.id);
    this.setState({ edit: ! this.state.edit });
  },
  handleDeleteClick: function(e) {
    // e.preventDefault();

    // Remove event
    userRef.child("events/" + this.props.id).remove();

    // Remove from all guest record
    {Object.keys(this.state.user.guests).map(function (guest, i) {
      userRef.child("guests/" + guest + "/events/" + this.props.id).remove();
      userRef.child("attending/" + guest + "/events/" + this.props.id).remove();
      userRef.child("notattending/" + guest + "/events/" + this.props.id).remove();
      userRef.child("invited/" + guest + "/" + this.props.id).remove();
    }.bind(this))}

  },
  handleFinishEdit: function() {
    this.setState({
      editField: false,
      editCourse: false
    })
  },
  handleEditCourse: function(course, event) {
    var value = event.target.value;
    // console.log(value)

    userRef.child("courses/" + this.props.id + "/" + course).update({
      name: value
    });
    // alert("Changing " + course);

  },
  handleCourse: function() {
		var timeInMs = Date.now();
		var randomNo = Math.floor(Math.random() * 1000) + 1;

		var courseName = this.refs.courseName.getDOMNode().value;
		var string = (courseName+ randomNo).replace(/ /g,'').toLowerCase();

		var course = this.state.course;

		course[string] = {
			date_created: timeInMs,
			name: courseName,
			meals: {}
		}

		this.setState({
			course : course
		});

    console.log(this.state.course);

	},
	handleMeal: function() {
		var timeInMs = Date.now();
		var randomNo = Math.floor(Math.random() * 1000) + 1;

		var courseSelect = this.refs.courseSelect.getDOMNode().value;
		var mealName = this.refs.mealName.getDOMNode().value;

		var string = (mealName+ randomNo).replace(/ /g,'').toLowerCase();

		var course = this.state.course;

		course[courseSelect].meals[string] = {
			date_created: timeInMs,
			name: mealName
		}

		this.setState({
			course: course
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
