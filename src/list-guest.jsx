var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');
var Choice = require('./choice');

function logging(name,object,type) {
	if(type == "obj") {
		console.log(object);
	} else {
		console.log(name + ": " + object);
	}
}

function date(timestamp) {
	var date = new Date(timestamp);

	var year = date.getUTCFullYear();
	var month = date.getUTCMonth();
	var day = date.getUTCDate();

	//month 2 digits
	month = ("0" + (month + 1)).slice(-2);

	//year 2 digits
	year = year.toString().substr(2,2);

	return formattedDate = day + '/' + month + "/" + year;
}


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
    if(this.props.user && this.props.user.guests[this.props.id].events) {
      this.setState({ eventChoices: this.props.user.guests[this.props.id].events });
    }

  },
	handleEditDelete: function() {
		alert("hello")
	},
  render: function() {
  return <div>

    {this.renderList()}
  </div>

  },
  renderList: function() {


    if(this.props.user.events) {
          // Loop through event choices object for simple toggle
          var eventOptions = Object.keys(this.props.user.events).map(function (key, i) {
            return <Choice key={key} id={key} value={i} name={this.props.user.events[key].name} handleChoice={this.handleChoice} active={this.props.guest.events ? (this.props.guest.events[key] ? true : false) : ''}/>
          }.bind(this));
        } else {
          var eventOptions = "Not set";
    }

    if(this.state.edit) {
      return <div className="cont cont__flex-column">

        <div className="row">
          <div className="col-md-6">
          <label>First name</label>
            <p><input type="text" className="form-control" defaultValue={this.props.guest.fname} ref="fName" /></p>
          </div>
          <div className="col-md-6">
            <label>Last name</label>
            <p><input type="text" className="form-control" defaultValue={this.props.guest.lname} ref="lName" /></p>
        </div>
      </div>
      <div className="row">

        <div className="col-md-12">
          <label>Email</label>
          <input type="text" className="form-control" defaultValue={this.props.guest.email} ref="email" />
        </div>

      </div>

				<div className="col-md-12">
					<h5>What event/s are they invited to?</h5>
          {eventOptions}
        </div>

        <div className="col-md-12 add__cta">
          <button onClick={this.handleChange} className="btn btn--gold">Save</button> <button onClick={this.handleEditClick} className="btn btn-default">Cancel</button>
        </div>

    </div>
    } else {

      return <div className="row">

				<div className="guest">
					<div className="col-md-5">
	          {this.props.guest.fname + " " + this.props.guest.lname} {this.props.guest.email}

						{date(this.props.guest.date_created) == date(Date.now()) &&
							<span className="badge badge--new">New</span>
						}

						{date(this.props.guest.date_updated) == date(Date.now()) &&
							<span className="badge badge--updated">Updated</span>
						}

	        </div>

						{(this.props.meals && this.props.user.attending[this.props.id] && this.props.user.attending[this.props.id].events[this.props.eventId].courses) &&

							<div className="col-md-5">
								{Object.keys(this.props.user.attending[this.props.id].events[this.props.eventId].courses).map(function (courseId) {
									var meal_uni = this.props.user.attending[this.props.id].events[this.props.eventId].courses[courseId].meal_name;

									return <span className="list__meal">
										{this.props.user.courses[this.props.eventId][courseId].name}: {this.props.user.courses[this.props.eventId][courseId].meals[meal_uni].name}
									</span>

								}.bind(this))}
							</div>

						}


						{(this.props.all && this.props.user.attending[this.props.id]) &&
								Object.keys(this.props.user.attending[this.props.id].events).map(function (eventId) {

									return <div>

									{this.props.user.attending[this.props.id].events[eventId].courses &&

										<div>

											{this.props.user.events[eventId].name} :

											{Object.keys(this.props.user.attending[this.props.id].events[eventId].courses).map(function (courseId) {
												var meal_uni = this.props.user.attending[this.props.id].events[eventId].courses[courseId].meal_name;

												return <span>{this.props.user.courses[eventId][courseId].meals[meal_uni].name} </span>
											}.bind(this))}

										</div>

									}


								</div>

								}.bind(this))
						}


					{this.props.attending == false &&
		        <div className="col-md-5">
		          {this.props.guest.events &&
		            Object.keys(this.props.guest.events).map(function (event) {
		              return <span>{this.props.user.events[event] ? this.props.user.events[event].name : null} </span>
		            }.bind(this))
		          }
		        </div>
					}


	        {this.props.attending == false &&
	          <div className="col-md-4 tar guest__links">
	            <a className="link" href={"/#/page/" + this.props.user.authid + "/" + this.props.id} target="blank">Guest view</a>
	            <a className="link link--edit" onClick={this.handleEditClick}><i className="material-icons">mode_edit</i></a>
							<a className="link link--delete" onClick={this.handleDeleteClick}><i className="material-icons">delete</i></a>
	          </div>
	        }
				</div>

      </div>
    }


  },
  handleEditClick: function() {
    this.setState({ edit: ! this.state.edit })
  },
  handleDeleteClick: function() {
    var id = this.props.id;
    this.props.handleDeleteGuest(null,null,null,null,id,"remove");
  },
  handleChange: function() {
    var fname = this.refs.fName.getDOMNode().value;
		var lname = this.refs.lName.getDOMNode().value;
		var email = this.refs.email.getDOMNode().value;
		var choices = this.state.eventChoices;
    var id = this.props.id;

    // logging("Fname",this.refs.fName.getDOMNode().value,false);
    // logging("Lname",this.refs.lName.getDOMNode().value,false);
    // logging("Email",this.refs.email.getDOMNode().value,false);
    // logging(false,this.state.eventChoices,"obj");

    this.props.handleEditGuest(fname,lname,email,choices,id);
    this.setState({ edit: ! this.state.edit });
  },
  handleChoice: function(choice,id,truth) {

    var choices = this.state.eventChoices;

    //Toggle - If true then add to state if nto remove
    if(truth == true) {
      choices[id] = true;
    } else {
      delete choices[id];
      this.setState({eventChoices: choices});
    }

  }
});
