var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

var DatePicker = require('react-datepicker');
var moment = require('moment');

require('react-datepicker/dist/react-datepicker.css');

module.exports = React.createClass({
  mixins: [ReactFire],
  getInitialState: function() {
  return {

    }
  },
  componentWillMount: function() {

    // Preload guest & event data
    var authData = ref.getAuth();
    this.fb = new Firebase(rootUrl + 'users/' + authData.uid);

  },
  handleCutoff: function() {
    var date = this.refs.cutoffDate.getDOMNode().value;
    var d = new Date(date);

    console.info(d);

  },
  render: function() {
    return <div>

      <h4>When do you want your cutoff?</h4>
      <input type="text" ref="cutoffDate"/>
      <button onClick={this.handleCutoff}>Save</button>
      
        <DatePicker selected={this.state.startDate} onChange={this.handleChange} />

      {Object.keys(this.props.user.playlist).map(function (track, i) {

        return <div>
            <h4>{this.props.user.playlist[track].artist_name} - {this.props.user.playlist[track].track_name} - {track} </h4>
            <img src={this.props.user.playlist[track].album_image} />
        </div>


      }.bind(this))}


    </div>
  },
  handleClick: function() {

  }

});
