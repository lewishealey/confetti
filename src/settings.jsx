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

var URL = "http://localhost:8888/confettiapp/";

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


var spotifyApi = new Spotify();



function toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum;
}

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

    if(this.props.user.access_token) {
      spotifyApi.setAccessToken(this.props.user.access_token);

      spotifyApi.getUserPlaylists(this.props.user.sp_user)
        .then(function(data) {
          this.setState({
            spotify_playlist: data.items
          })
        }.bind(this), function(err) {
          console.error(err);
        });
    }

  },
  componentWillReceiveProps: function(nextProps) {

    if(this.props.user.access_token !== nextProps.user.access_token) {

      this.setState({
        spotify_auth: true
      })

      this.handlePopup("success",("Spotify settings saved"));

    }


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
  handleSpotify: function() {

    if(this.props.user) {
      window.open(URL + "server/spotify_auth.php?authid=" + this.props.user.authid, '_blank', 'location=yes,height=570,width=520,scrollbars=no,status=yes');
    }

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

    {this.state.spotify_auth || this.props.user.access_token &&
      <div className="status success">
        Your spotify is set-up! you can now add your tracks to your playlist <button className="btn btn--spotify" onClick={this.handleSpotify}>Refresh</button>
      </div>
    }

    {!this.state.spotify_auth && !this.props.user.access_token &&
      <button className="btn btn--spotify" onClick={this.handleSpotify}>Connect your Spotify</button>
    }


    </div>
  },
  handleClick: function() {

  }

});
