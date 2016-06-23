var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

var ListGuest = require('./list-guest');

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
  return {
      eventId: false
    }
  },
  componentWillMount: function() {

    if(this.props.user && this.props.user.events) {
      var events = this.props.user.events;

      var firstProp;
      for(var key in events) {
          if(events.hasOwnProperty(key)) {
              firstProp = key;
              break;
          }
      }

      if(firstProp) {
        this.setState({eventId: firstProp})
      }

    }

  },
  toggleEvent: function(key) {
    this.setState({eventId: key});
  },
  buttonClick: function(type,text) {
    this.props.handlePopup(type,text);
  },
  render: function() {

    if(this.props.user && this.props.user.events) {
      var events = this.props.user.events;
    }

    return <div>

    <div className="row">

        <div className="col-md-6">
            <h4>Whos attending</h4>
            <p>See which guests are attending <a onClick={this.onToggleAddEvent.bind(this,"add","guest")}>Add Guest</a></p>
            <button onClick={this.buttonClick.bind(this,"success","Guest added!")}>Button</button>
            <button onClick={this.buttonClick.bind(this,"default","Notice added!")}>Notice Button</button>
        </div>

    </div>

    <div className="row">

      <div className="col-md-12">

        <div className="event-bar">
          {this.props.user.events &&
            Object.keys(this.props.user.events).map(function (key) {
              if(this.props.user.events[key].attending) {
                return <div className={"event-bar__item " + (this.state.eventId == key ? "active" : "")} onClick={this.toggleEvent.bind(this,key)}>
                  {this.props.user.events[key] ? this.props.user.events[key].name : null}
                </div>
              }
            }.bind(this))
          }
          <div className="event-bar__item event-bar__item--add"  onClick={this.onToggleAddEvent.bind(this,"add","event")}>
            Add a new event
          </div>
        </div>

        {(this.state.eventId && this.props.user.events[this.state.eventId].attending) &&
          Object.keys(this.props.user.events[this.state.eventId].attending).map(function (key) {
            return <ListGuest guest={this.props.user.guests[key]} key={key} user={this.props.user} id={key} eventId={this.state.eventId} handleEditGuest={this.handleEditGuest} handleDeleteGuest={this.handleDeleteGuest} attending={true} meals={true} />
          }.bind(this))
        }

      </div>

    </div>


  </div>
},
  onToggleAddEvent: function(action,type, event) {
    event.preventDefault();
		this.props.handleAction(action,type);
	}

});
