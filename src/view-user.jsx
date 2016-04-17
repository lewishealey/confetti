var React = require('react');
var ViewGuest = require('./view-guest');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      loaded: false
    }
  },
  componentWillMount: function() {
  },
  componentDidMount: function() {
    console.log(this.props.user);

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
      var content = <ViewGuest user={this.props.user} guest={this.state.guest} guestId={this.state.guest_id} onChange={this.handleGuest} />
    } else {
      var content = "Choose your guest";
    }

    return <div>

      <input onChange={this.onSearchGuest} className="form-control"/>

      {this.state.guestSearch &&
        Object.keys(this.state.guestSearch).map(function (key, i) {

          return <p>{this.state.guestSearch[key].fname + " " + this.state.guestSearch[key].lname} <span onClick={this.onSelectGuest.bind(this, this.state.guestSearch[key], key)}>Select</span></p>

        }.bind(this))

      }

      {content}

    </div>
  },
  onSearchGuest: function(e) {
    var value = e.target.value;

    if(this.state.guestSearch) {
      var currentGuest = this.state.guestSearch;
    } else {
      var currentGuest = {};
    }

    if(value.length > 2 ) {

      Object.keys(this.props.user.guests).map(function (key, i) {
        var guest = this.props.user.guests[key];
        var search = guest.fname.search(new RegExp(value));

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
  onSelectGuest: function(guestData, key) {

    this.setState({
      guest : guestData,
      guest_id: key
    });

  }

});
