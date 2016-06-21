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

    return <div className="register">

      <h4 className="register__title">Don't have an account? <br />Register below</h4>
      <p><button type="submit" className="btn btn--dark" onClick={this.handleRegister}>{this.state.loading ? "Loading" : "Register now"}</button></p>

      {this.state.register &&

        <div>

        <h4>Register</h4>
        <form>

          <label>Email</label>
          <p><input type="email" className="form-control" ref="regEmail" name="email" required/></p>

          <label>Password</label>
          <p><input type="password" className="form-control" ref="regPassword" name="password" required/></p>

          <button type="submit" className="btn btn--dark" onClick={this.handleClick.bind(this,"button")}>Register</button>
        </form>

        </div>

      }


        </div>

      }
});
