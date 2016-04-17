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

    var eventClass;

    if(this.props.user.invited[this.props.guestId] && this.state.loaded) {


      return <div className="cont">
        {Object.keys(this.props.user.invited[this.props.guestId]).map(function (key, i) {

            return <div className={"column__half-width event__single"} key={i}>

                <div className="column--nest">

                  <div className="column cont">
                    <div className="column__half-width">
                      <h4 className="event__title">{this.props.user.events ? this.props.user.events[key].name : ''}</h4>
                    </div>

                    <div className="column__half-width">
                      <h4>Time</h4>
                    </div>
                  </div>

                  {this.props.user.events[key].address &&
                    <div className="column">
                      <p className="sub">
                        {this.props.user.events[key].address + ", " + this.props.user.events[key].postcode}<br />
                        <a href="#">View on map</a>

                        {(this.props.user.attending && this.props.user.attending[this.props.guestId]) &&
                          this.props.user.attending[this.props.guestId][key] ? "Attending" : "Not attending"
                        }

                      </p>
                    </div>
                  }

                  <div className="column">
                    <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b" onClick={this.handleAttending.bind(this,this.props.guestId,key,true)}>Attending</a>
                    <a className="btn btn--outline btn--rose-o btn--icon btn--icon-cross btn--m-b" onClick={this.handleAttending.bind(this,this.props.guestId,key,false)}>Not Attending</a>
                  </div>

                </div>

            </div>


        }.bind(this))}

      </div>


    } else {
      return <div>
        Sorry you are not invited to anything yet
      </div>
    }

  },
  handleAttending: function(guest, event, truth) {
      this.props.onChange(guest, event, truth);
  }

});
