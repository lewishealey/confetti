var React = require('react');
var Firebase = require('firebase');
var rootUrl = 'https://boiling-fire-2669.firebaseio.com/';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      active: false
    }
  },
  componentWillMount: function() {
  },
  render: function() {
    return <a className={"btn btn-default" + (this.state.active ? " active" : "")} onClick={this.handleClick.bind(this,this.props.name)}>
      {this.props.name}
      </a>
  },
  handleClick: function(name) {
    this.setState({ active: ! this.state.active });

    if(this.state.active == false) {
      this.props.handleChoice(name,true);
    } else {
      this.props.handleChoice(name,false);
    }

  }
});
