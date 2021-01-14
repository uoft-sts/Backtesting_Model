import './App.css';
//import DateComponent from "./DateComponent"
import logo from "./sts-logo.png";
import React, { useState, useEffect } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry';
import FileUploader from './FileUploader'
import {Redirect} from 'react-router-dom';

function App(){
  const [value, onChange] = useState([new Date(), new Date()]);
  const onSubmit = () => {
    return <Redirect to="/Dashboard/" />
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" className="App-logo"/>
        <form action="http://localhost:5000/result" method="post" class="dropzone dz-clickable" id="dropper" enctype = "multipart/form-data">
          <label for="underlying">Underlying:</label>
          <input type="text" id="underlying" name="underlying" placeholder="Ex: a, AL"/><br /><br />
          <label for="expmonth">Expiration Month:</label>
          <input type="text" id="expmonth" name="expmonth" placeholder="Ex: 08, 11"/><br /><br />
          <label for="method">Select a method:</label>
          
            <select name="method" id="method" class="select">
              <option name="fom">First Of Month</option>
              <option name="ltd">Last Trading Day</option>
              <option name="lb">Liquidity Based</option>
            </select>
          <br />
          <br />
          <div>
            <DateRangePicker
              onChange={onChange}
              value={value}
            />
          </div>
          <br />
          <div>
            <FileUploader />
          </div>
          <br />
          <input type="submit" className="submit-button" onClick={onSubmit} value="Submit"/>
        </form>
      </header>
    </div>
  );
}

export default App;
