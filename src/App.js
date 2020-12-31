import './App.css';
//import DateComponent from "./DateComponent"
import logo from "./sts-logo.png";
import React, { useState, useEffect } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry';


function App(){
  const [value, onChange] = useState([new Date(), new Date()]);
  //const [currentTime, setCurrentTime] = useState(0);

  // useEffect(() => {
  //   fetch('/time').then(res => res.json()).then(data => {
  //     setCurrentTime(data.time);
  //   });
  // }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="logo" className="App-logo"/>
        <form action="http://localhost:5000/result" method="post" enctype = "multipart/form-data">
          <label for="myfile" className="file-upload">Select a file:</label>
          <input type="file" id="myfile" name="myfile" /> <br /> <br /> 
          
          <div>
            <DateRangePicker
              onChange={onChange}
              value={value}
            />
          </div>
          
          {/* <div>
            <DateComponent />
          </div> */}
          <br />
          <input type="submit" className="submit-button" value="Submit"/>
        </form>
      </header>
    </div>
  );
}

export default App;
