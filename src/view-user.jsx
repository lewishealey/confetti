var React = require('react');
var ViewGuest = require('./view-guest');

count = 1;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      loaded: false,
      step: 1
    }
  },
  componentWillMount: function() {
  },
  componentDidMount: function() {
    // console.log(this.props.user);
    this.setState({
      loaded: true
    });
  },
  handleGuest: function(guest, event, truth) {
    //Pass data up
    this.props.onChange(guest, event, truth);
  },
  render: function() {

    if(this.state.guest) {
      var content = <ViewGuest user={this.props.user} onCourseMealChange={this.onCourseMealChange} guest={this.state.guest} guestId={this.state.guest_id} onChange={this.handleGuest} />
    } else {
      var content = "Choose your guest";
    }

    return <div className="guest-select">

      <h4>Step {this.state.step} of 3</h4>
      <button onClick={this.onClearSearch}>Clear search</button>

      {(!this.state.guest && this.state.step == 1) &&
        <input onChange={this.onSearchGuest} className="form-control" placeholder="Enter your name" ref="input-guest" required autoComplete="fname" />
      }

      {this.state.guestSearch  &&

        <ul className="guest-list">
        {Object.keys(this.state.guestSearch).map(function (key, i) {

          return <li className="guest-list__item" onClick={this.onSelectGuest.bind(this, this.state.guestSearch[key], key)}>{this.state.guestSearch[key].fname + " " + this.state.guestSearch[key].lname} <span className="guest-list__select">That's me</span></li>

        }.bind(this))}

      </ul>

      }

      <div className="cont cont__flex-column">

        <div className="column">
          {(this.state.guest_id && this.state.step == 2) &&
            <div>
              <h4>Please enter your email address</h4>
              <p>This is so the happy couple can make announcements about anything important with the wedding.</p>
                <input onChange={this.onHandleEmail} className={"form-control " + (this.props.handleEmailState && this.props.handleEmailState == true ? 'success' : 'error')}  placeholder="Enter your email address" ref="input-guest" name="email" />
                <small>We DO NOT use your email address for anything apart from communicating with the happy couple. We will actually delete your email from our records post-wedding.</small>
            </div>
          }
          {this.props.handleEmailState ? this.props.handleEmailState : ''}
        </div>

        {(this.state.step == 3) &&
          <div className="column">
            {content}
          </div>
        }

        <div className="column">
          {this.state.guest_id &&
            <p><strong>Tip: </strong>You can visit this link whenever you want to update your status if things change. Save this website {"http://localhost/confetti_app/#/" + this.props.userId + "/" + this.state.guest_id}</p>
          }
        </div>

      </div>

    </div>
  },
  onHandleEmail: function(e) {
    // Pass email address and guest ID up to source of truth
    var value = e.target.value;

    // Pass data up to be saved
    this.props.handleEmail(value,this.state.guest_id);

    // Set the step
    this.setState({
      step: 3
    });

  },
  onClearSearch: function() {

    this.setState({
      guest: false,
      guest_id: false,
      guestSearch: false,
      step: 1
    });

  },
  onSearchGuest: function(e) {
    var value = e.target.value;
    // var re = new RegExp('\\b'+value+'\\b','i');
    var re = new RegExp(value,'i');

    if(this.state.guestSearch) {
      var currentGuest = this.state.guestSearch;
    } else {
      var currentGuest = {};
    }

    if(value.length > 2 ) {

      Object.keys(this.props.user.guests).map(function (key, i) {
        var guest = this.props.user.guests[key];
        var search = (guest.fname + " " + guest.lname).search(re);

        // console.log(guest.fname + " - " + search);

        if(search != -1) {
          currentGuest[key] = guest;
        }

      }.bind(this))

      this.setState({ guestSearch : currentGuest });

    } else {
      var currentGuest = {};
      this.setState({ guestSearch : {} });
    }


  },
  onCourseMealChange: function(mealName, courseName, eventName, guestName) {
    this.props.onCourseMealChange(mealName, courseName, eventName, guestName);
  },
  onSelectGuest: function(guestData, key) {

    this.setState({
      guest : guestData,
      guest_id: key,
      guestSearch: false,
      step: 2
    });

  }

});
