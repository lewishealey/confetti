import React from "react";
import ReactDOM from 'react-dom';
import { firebase } from 'firebase';
import Test from './test';

var config = {
    apiKey: "AIzaSyAHtWVPUl1Q9shCA-Qlr6QTDaNbcRwbMJ0",
    databaseURL: "https://boiling-fire-2669.firebaseio.com",
    authDomain: "boiling-fire-2669.firebaseapp.com",
    storageBucket: "boiling-fire-2669.appspot.com"
  };

  // firebase.initializeApp(config);

ReactDOM.render(<Test />, document.getElementById("app"));
