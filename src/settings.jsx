var React = require('react');
var ReactFire = require('reactfire');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';
var ref = new Firebase(rootUrl);

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
  render: function() {
    return <div>

    <h4>Hello</h4>

    </div>
  },
  handleClick: function() {

  }

});
