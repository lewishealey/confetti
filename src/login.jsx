var React = require('react');

module.exports = React.createClass({
handleClick:function(type,event) {

  // Handle on click button and enter press
  if(type === "button" || event.keyCode == 13) {
    var email = this.refs.email.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    this.props.login(email,password);
  }

},
  render: function() {

    return <div className="container">
    <h4>Welcome! Please login</h4>

        <form onKeyDown={this.handleClick.bind(this,"press")}>
          <div className="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" ref="email" name="email" />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" className="form-control" ref="password" name="password"/>
          </div>
          <button type="submit" className="btn btn-default" onClick={this.handleClick.bind(this,"button")}>Submit</button>
        </form>

        </div> 
  }

});
