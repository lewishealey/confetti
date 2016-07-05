var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

var Alert = require('./alert');

var DatePicker = require('react-datepicker');
var moment = require('moment');

var re = new RegExp(/^.*\//);
var ROOT = re.exec(window.location.href);

var axios = require('axios');

var Spotify = require('spotify-web-api-js');
var s = new Spotify();


var client_id = 'CLIENT_ID'; // Your client id
var client_secret = 'CLIENT_SECRET'; // Your secret
var redirect_uri = 'REDIRECT_URI'; // Your redirect uri

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


function toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum;
}

axios.get('https://accounts.spotify.com/authorize', {
  params: {
      client_id: '2888525482b94ccb86ae7ee9469bab07',
      response_type: 'code',
      redirect_uri: ROOT
    }
})
.then(function(response){
    console.log(response.headers);
    console.log(response); // ex.: { user: 'Your User'}
    console.log(response.status); // ex.: 200
  })
  .catch(function(res) {
    if(res instanceof Error) {
      console.log(res.message);
    } else {
      console.log(res.data);
    }
  });


module.exports = React.createClass({
  displayName: 'Example',
  mixins: [ReactFire],
  getInitialState: function() {
  return {
    startDate: moment(),
    edit: false,
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
  handleEdit: function() {
    this.setState({
      edit: !this.state.edit
    });
  },
  onChange: function(date) {

    this.setState({
      startDate: date
    });

  },
  handleCutoff: function() {

    this.props.handleCutoff(moment(this.state.startDate._d).toString());

    // Popup
    this.handlePopup("success",("Date set!"));

  },
  render: function() {

    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];


    if(this.props.user.settings.cutoff_date ) {

      var fullDate = moment(this.props.user.settings.cutoff_date).format('MMMM Do YYYY, h:mm:ss a');

    } else {
      var fullDate = false;
    }

    return <div>

      <Alert delay={2000} type={this.state.popup.type}>{this.state.popup.text}</Alert>

      <h2>When do you want your cutoff?</h2>

      {!this.state.edit &&
        <div>
          <h4>{moment(this.props.user.settings.cutoff_date).format('MMMM Do YYYY, h:mm:ss a')}</h4>
          <button className="btn" onClick={this.handleEdit}>Edit</button>
        </div>
      }

    {this.state.edit &&
      <div>
          <p><DatePicker selected={this.state.startDate} className="form-control" onChange={this.onChange} /></p>
          <button className="btn btn--gold" onClick={this.handleCutoff}>Save</button> <button className="btn" onClick={this.handleEdit}>Cancel</button>
      </div>
    }

    <h2>Recommended tracks</h2>
    <p>Export to CSV and Spotify coming shortly</p>

      {Object.keys(this.props.user.playlist).map(function (guest, i) {

        if(this.props.user.guests[guest]) {
          return <div className="row">
            <div className="guest">

              <div className="col-md-1">
                <img src={this.props.user.playlist[guest].album_image} className="list-track__image"/>
              </div>

              <div className="col-md-4">
                <span className="badge badge--added badge--first">Added by {this.props.user.guests[guest].fname + " " + this.props.user.guests[guest].lname}</span>
                <h4>{this.props.user.playlist[guest].artist_name} - {this.props.user.playlist[guest].track_name}</h4>
              </div>

          </div>

        </div>

        }


      }.bind(this))}


    </div>
  },
  handleClick: function() {

  }

});
