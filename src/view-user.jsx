var React = require('react');
var ViewGuest = require('./view-guest');

count = 1;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      loaded: false,
      step: 1,
      emailState: false,
      editTrack: false
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
  handleClearSearch: function(data) {
    this.props.handleClearSearch(data);
  },
  handlePopup: function(type,text) {
    this.props.handlePopup(type,text);
  },
  render: function() {

    if(this.state.guest) {
      var content = <ViewGuest user={this.props.user} onCourseMealChange={this.onCourseMealChange} guest={this.state.guest} guestId={this.state.guest_id} onChange={this.handleGuest} handleTrack={this.handleTrack} handlePopup={this.handlePopup} handleClearSearch={this.handleClearSearch} />
    } else {
      var content = "Choose your guest";
    }

    return <div className="guest-select">


    <div className="row">

      {this.props.step === 1 &&

        <div className="col-md-8 col-md-offset-2">
          <h4>To RSVP, simply enter your name</h4>
          <input onChange={this.onSearchGuest} className="form-control form-control--xl" placeholder="First name or Surname" ref="input-guest" required autoComplete="fname" />
            {this.state.guestSearch  &&

              <ul className="guest-list">
              {Object.keys(this.state.guestSearch).map(function (key, i) {

                return <li className="guest-list__item" onClick={this.onSelectGuest.bind(this, this.state.guestSearch[key], key)}>{this.state.guestSearch[key].fname + " " + this.state.guestSearch[key].lname} <span className="guest-list__select">That's me</span></li>

              }.bind(this))}

            </ul>

            }
        </div>

      }

      {this.props.step === 2 && (this.props.user.guests && this.props.user.guests[this.state.guest_id] && !this.props.user.guests[this.state.guest_id].email) &&
        <div className="col-md-8 col-md-offset-2">

        {this.state.guest_id &&

            <div>
              <h4>James & Seph would like to contact you via email</h4>
              <p>This is so they can make announcements about anything important with the wedding.</p>
                <p><input onChange={this.onInputEmail} className={"form-control form-control--xl " + (this.state.emailState && this.state.emailState == true ? 'success' : '')}  placeholder={this.props.user.guests[this.state.guest_id].email ? this.props.user.guests[this.state.guest_id].email : "Enter your email address to proceed"} ref="guestEmail" name="email" /></p>
                <p><small>This email will not be used for spam, we promise.</small></p>
                <p><button className="btn btn--dark" onClick={this.onHandleEmail}>Proceed</button></p>
                {this.props.handleEmailState ? this.props.handleEmailState : ''}
          </div>

        }

        </div>

      }

    </div>


        {this.props.step === 3 &&

          <div className="column">
            {content}
          </div>

        }


    </div>
  },
  onInputEmail: function(e) {

    var value = e.target.value;
    if(isEmail(value)) {
      this.setState({ emailState: true });
    } else {
      this.setState({ emailState: "Not valid" });
    }

  },
  onHandleEmail: function(e) {
    // Pass email address and guest ID up to source of truth
    var value = this.refs.guestEmail.getDOMNode().value;

    if(isEmail(value)) {
        // Pass data up to be saved
        this.props.handleEmail(value,this.state.guest_id);

        // Set the step
        this.setState({
          step: 3
        });

     } else {
       alert("Incorrect email address");
     }

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
  handleTrack: function(guestId,artistName,trackName,albumImage,trackHref,trackId,trackUri) {

    //Pass props up
    this.props.handleTrack(guestId,artistName,trackName,albumImage,trackHref,trackId,trackUri);
  },
  onSelectGuest: function(guestData, key) {

      if(this.props.user.guests[key] && this.props.user.guests[key].email) {
        this.props.onStep(3);
      } else {
        this.props.onStep(2);
      }

    this.setState({
      guest : guestData,
      guest_id: key,
      guestSearch: false,
      step: 2
    });

  }

});

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
