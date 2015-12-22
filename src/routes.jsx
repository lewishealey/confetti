var React = require('react');
var ReactFire = require('reactfire');

// Router Shiz
var HashHistory = require('react-router/lib/hashhistory');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link
var View = require('./view');
var Dashboard = require('./dashboard');
var Main = require('./main');

module.exports = (
render: function() {
	var authData = ref.getAuth();
    
    if (authData) {
      <Router history={new HashHistory}>
    	<Route path="/" component={Main}>
        <Route path="/dashboard" component={Dashboard} />
      </Route>
    <Route path="/view" component={View} />
  </Router>

    } else {
    	return <div> Nope</div>
    }
}
  )
