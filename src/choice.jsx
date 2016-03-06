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
    if(this.props.active) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false });
    }
  },
  render: function() {
    return <a className={"btn btn--choice" + ((this.state.active) ? " active" : "")} onClick={this.handleClick.bind(this,this.props.name,this.props.id)}>
      {this.props.name} 
      </a>
  },
  handleClick: function(name,id) {
    this.setState({ active: ! this.state.active });

    if(this.state.active == false) {
      this.props.handleChoice(name,id,true);
    } else {
      this.props.handleChoice(name,id,false);
    }

  }
});
