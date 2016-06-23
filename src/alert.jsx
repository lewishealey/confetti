var React = require('react');

module.exports = React.createClass({
  getDefaultProps: function() {
    return {delay: 2000};
  },
  getInitialState: function(){
    return {visible: false};
  },
  componentWillReceiveProps: function(nextProps) {

    this.setTimer();
    this.setState({visible: true});
    
    // reset the timer if children are changed
    if (nextProps.children !== this.props.children) {
      this.setTimer();
      this.setState({visible: true});
    }
  },
  componentDidMount: function() {
      this.setTimer();
  },
  setTimer: function() {
    // clear any existing timer
    this._timer != null ? clearTimeout(this._timer) : null;

    // hide after `delay` milliseconds
    this._timer = setTimeout(function(){
      this.setState({visible: false});
      this._timer = null;
    }.bind(this), this.props.delay);
  },
  componentWillUnmount: function() {
    clearTimeout(this._timer);
  },
  render: function() {
    console.log(this.props.type)
    if(this.state.visible) {
      return <div className={"alert " + this.props.type} >{this.props.children}fwe</div>
    } else {
      return false
    }

  }


});
