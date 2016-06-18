var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

function toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum;
}

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
  // toTimestamp('02/13/2009' + '23:59:59');

    var date = toTimestamp(this.refs.cutoffDate.getDOMNode().value + " 00:00:01");
    // console.info(date);

    this.props.handleCutoff(date);

  },
  render: function() {

    if(this.props.user.settings.cutoff_date ) {
      var date = new Date(this.props.user.settings.cutoff_date );
    } else {
      var date = "Not set"
    }

    return <div>

      <h4>When do you want your cutoff? (MM/DD/YYYY)</h4>
      <input type="text" ref="cutoffDate" defaultValue={date ? date : "MM/DD/YYYY"} placeholder="MM/DD/YYYY"/>
      <button onClick={this.handleCutoff}>Save</button>



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
