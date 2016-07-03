var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

var Alert = require('./alert');


function toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum;
}

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
  return {
      popup: {
        open: false, text: false, type: false, count: 0
      }
    }
  },
  componentWillMount: function() {

    // Preload guest & event data
    var authData = ref.getAuth();
    this.fb = new Firebase(rootUrl + 'users/' + authData.uid);

  },
  handlePopup: function(type,text) {

		this.setState({
			popup : {
				type: type,
				text: text
			}
		})

	},
  handleCutoff: function() {
  // toTimestamp('02/13/2009' + '23:59:59');

    var date = toTimestamp(this.refs.cutoffDate.getDOMNode().value + " 00:00:01");
    // console.info(date);

    this.props.handleCutoff(date);

    // Popup
    this.handlePopup("success",(date + " set!"));

  },
  render: function() {

    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];


    if(this.props.user.settings.cutoff_date ) {
      var date = new Date(this.props.user.settings.cutoff_date);
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      var fullDate = day + ' ' + monthNames[monthIndex] + ' ' + year;

    } else {
      var date = "Not set"
    }

    return <div>

      <Alert delay={2000} type={this.state.popup.type}>{this.state.popup.text}</Alert>

      <h4>When do you want your cutoff? (MM/DD/YYYY)</h4>
      <input type="text" ref="cutoffDate" defaultValue={fullDate ? fullDate : "MM/DD/YYYY"} placeholder="MM/DD/YYYY"/>
      <p>{fullDate ? fullDate : "Date not set"}</p>
      <button onClick={this.handleCutoff}>Save</button>

    <h4>FAQ page</h4>

      {Object.keys(this.props.user.playlist).map(function (track, i) {

        return <div className="row">

          <div className="col-md-4">
            <h4>{this.props.user.playlist[track].artist_name} - {this.props.user.playlist[track].track_name} - {track} </h4>
          </div>

          <div className="col-md-2">
            <img src={this.props.user.playlist[track].album_image} className="list-track__image"/>
          </div>

        </div>


      }.bind(this))}


    </div>
  },
  handleClick: function() {

  }

});
