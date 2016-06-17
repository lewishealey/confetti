var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      loaded: false
    }
  },
  componentWillMount: function() {

    if(this.props.loaded) {
      this.setState({ loading: false });
    } 

    if(this.props.loaded == false) {
      this.setState({ loading: false });
    }

  },
  handleClick: function() {
    var email = this.refs.email.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;

    this.props.login(email,password);
    this.setState({ loading: true });
    
  },
  render: function() {
    return <div className="column">
    <img src="img/confetti_logo.png" width="169" />
    <h4>Welcome! Please login</h4>

          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" ref="email" name="email" />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" ref="password" name="password"/>
          </div>
          <button type="submit" className="btn btn--gold" onClick={this.handleClick}>{this.state.loading ? "Loading" : "Submit"}</button>

        </div> 
  }

});
