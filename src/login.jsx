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
    return <div>

      <div className="login__header">
        <img src="https://firebasestorage.googleapis.com/v0/b/boiling-fire-2669.appspot.com/o/logo-grey.png?alt=media&token=d19cc3bf-32fe-4744-a73a-0834c7798477" width="200" className="login__logo"/>
      </div>

          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" ref="email" name="email" />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" ref="password" name="password"/>
          </div>

          <button type="submit" className="btn btn--gold" onClick={this.handleClick}>{this.state.loading ? "Loading" : "Login"}</button>

        </div>
  }

});
