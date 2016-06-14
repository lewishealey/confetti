var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');


module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return({
      loaded: false
    })
  },
  componentWillMount: function() {
  },
  componentDidMount: function() {
    this.setState({
      loaded: true
    })
  },
  componentWillReceiveProps: function() {
  },
  render: function() {

    if(this.props.user.invited[this.props.guestId] && this.state.loaded) {

      var eventClass = {};

      return <div className="cont">
        {Object.keys(this.props.user.invited[this.props.guestId]).map(function (key, i) {

          var eventKey = key;
          eventClass[eventKey] = false;

          if(this.props.user.attending && this.props.user.attending[this.props.guestId] && this.props.user.attending[this.props.guestId].events && this.props.user.attending[this.props.guestId].events[key]) {
            eventClass[eventKey] = "attending";
          }

          if(this.props.user.notattending && this.props.user.notattending[this.props.guestId] && this.props.user.notattending[this.props.guestId].events && this.props.user.notattending[this.props.guestId].events[key]) {
            eventClass[eventKey] = "nattending";
          }

          // console.log(eventClass);

            return <div className={"column__half-width event__single " + eventClass[key]} key={i}>

              {! eventClass[eventKey] &&

                      <div className="column--nest">

                        <div className="column cont">
                          <div className="column__half-width">
                            <h4 className="event__title">{this.props.user.events ? this.props.user.events[key].name : ''}</h4>
                          </div>

                          <div className="column__half-width">
                            {this.props.user.events[key].to &&
                              <p>
                                {this.props.user.events[key].to + " - " + this.props.user.events[key].from}
                              </p>
                            }
                          </div>
                        </div>

                        {this.props.user.events[key].address &&
                          <div className="column">
                            <p className="sub">
                              {this.props.user.events[key].address + ", " + this.props.user.events[key].postcode}<br />
                            <a href="#">View on map</a>

                            </p>
                          </div>
                        }

                        <div className="column">
                          <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b" onClick={this.handleAttending.bind(this,this.props.guestId,key,true)}>Attending</a>
                          <a className="btn btn--outline btn--rose-o btn--icon btn--icon-cross btn--m-b" onClick={this.handleAttending.bind(this,this.props.guestId,key,false)}>Not Attending</a>
                        </div>

                      </div>

                  }

                  {eventClass[eventKey] == "attending" &&
                    <div className="column">
                      <div className="column--nest">

                        <div className="column cont">
                          <div className="column__half-width">
                            <h4 className="event__title event--attending">Attending</h4>
                          </div>

                          <div className="column__half-width event__attending-icon">
                            <i className="material-icons">done</i>
                          </div>

                        </div>

                        <h4>{this.props.user.events[key].name}</h4>
                        {this.props.user.events[key].to &&
                          <p>
                            {this.props.user.events[key].to + " - " + this.props.user.events[key].from}
                          </p>
                          }
                        <p>Thanks for attending! A notification has been sent to Lewis & Lucy to let them know you'll be at the big day.</p>
                        <a onClick={this.handleAttending.bind(this,this.props.guestId,key,false)}>I cannot attend</a> <a>Add to calendar</a>

                      {this.props.user.courses && this.props.user.courses[key] &&
                        <div>
                          has meals

                          {Object.keys(this.props.user.courses[key]).map(function (course, i) {

                            return <div>

                              <h4 key={i}>Select a meal for {this.props.user.courses[key][course].name}</h4>

                            {(this.props.user.courses[key][course] && this.props.user.courses[key][course].meals) &&

                              <select className="form-control" onChange={this.handleCourseMeal.bind(this,course,key,this.props.guestId )}>
                                <option>{this.props.user.attending[this.props.guestId].events[key].courses[course] ? this.props.user.courses[key][course].meals[this.props.user.attending[this.props.guestId].events[key].courses[course].meal_name].name  : "Select a meal option"}</option>
                                {Object.keys(this.props.user.courses[key][course].meals).map(function (meal, i) {
                                  return <option key={meal} value={meal}>{this.props.user.courses[key][course].meals[meal].name}</option>
                                }.bind(this))}
                              </select>

                            }


                            </div>


                          }.bind(this))}

                        </div>
                    }
                  </div>
                  </div>
                  }

                  {eventClass[eventKey] == "nattending" &&
                    <div className="column">
                      <div className="column--nest">

                        <div className="column cont">
                          <div className="column__half-width">
                            <h4 className="event__title event--nattending">Not Attending</h4>
                          </div>

                          <div className="column__half-width event__nattending-icon">
                            <i className="material-icons">clear</i>
                          </div>

                        </div>

                        <h4>{this.props.user.events[key].name}</h4>
                        <p>Oh no! you can't attending :( Fancy letting them as to why?</p>
                        <a onClick={this.handleAttending.bind(this,this.props.guestId,key,true)}>I can attend now</a>
                      </div>
                  </div>
                  }

                </div>

        }.bind(this))}

      </div>


    } else {
      return <div>
        Sorry you are not invited to anything yet
      </div>
    }

  },
  handleCourseMeal: function(courseName, eventName, guestName ,event) {
    var mealName = event.target.value;
    this.props.onCourseMealChange(mealName, courseName, eventName, guestName);
  },
  handleAttending: function(guest, event, truth) {
      this.props.onChange(guest, event, truth);
  }

});
