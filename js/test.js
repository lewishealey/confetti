import React, {Component} from 'react';

class Test extends Component {

  componentWillMount: function() {
    var ref = firebase.database().ref("users");
    console.log(ref)
  },
  render() {
    return (
      <div>
      <h1>This is React!</h1>
    <p>Hello</p>
    <p>hello</p>
    <p>hello</p>
  </div>
);
  }
}
export default Test;
