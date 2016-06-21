var React = require('react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      register: false,
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
  handleClick:function(type,event) {

    // Handle on click button and enter press
    if(type === "button" || event.keyCode == 13) {
      event.preventDefault();
      var email = this.refs.regEmail.getDOMNode().value;
      var password = this.refs.regPassword.getDOMNode().value;
      this.props.register(email,password);
    }

    this.setState({ loading: true });

  },
  handleRegister: function() {
    this.setState({ register: ! this.state.register })
  },
  render: function() {

    return <div className="column">

      <button type="submit" className="btn btn--outline" onClick={this.handleRegister}>{this.state.loading ? "Loading" : "Register"}</button>

      {this.state.register &&

        <div>

        <h4>Register</h4>
        <form>

          <label>Email</label>
          <input type="email" className="form-control" ref="regEmail" name="email" required/>

          <label>Password</label>
          <input type="password" className="form-control" ref="regPassword" name="password" required/>

          <button type="submit" className="btn btn-default" onClick={this.handleClick.bind(this,"button")}>Register</button>
        </form>

        </div>

      }


        </div>

      }
});
