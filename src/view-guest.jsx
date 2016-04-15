var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ReactFire = require('reactfire');


module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
    return({
      guest: this.props.guest,
      guest_id: this.props.guestId,
      user: this.props.user
    })
  },
  componentWillMount: function() {
  },
  componentDidMount: function() {
  },
  render: function() {
    console.log(this.state.user);

    if(this.state.user.invited[this.props.guestId]) {

      return <div>
        {Object.keys(this.state.user.invited[this.props.guestId]).map(function (key, i) {

              <div>
                    <div className="column cont">
                      <div className="column__half-width">
                        <h4 className="event__title">{this.state.user.events ? this.state.user.events[key].name : ''}</h4>
                      </div>

                      <div className="column__half-width">
                        <h4>Time</h4>
                      </div>
                    </div>

                    {this.state.user.events[key].address &&
                      <div className="column">
                        <p className="sub">
                          {this.state.user.events[key].address + ", " + this.state.user.events[key].postcode}<br />
                          <a href="#">View on map</a>
                        </p>
                      </div>
                    }

                    <div className="column">
                      <a className="btn btn--outline btn--gold-o btn--icon btn--icon-tick btn--m-b">Attending</a>
                      <a className="btn btn--outline btn--rose-o btn--icon btn--icon-cross btn--m-b">Not Attending</a>
                  </div>

                </div>

        }.bind(this))}

      </div>


    } else {
      return <div>
        Sorry you are not invited to anything yet
      </div>
    }

  }

});
